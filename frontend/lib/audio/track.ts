import { EventEmitter } from 'events';
import { Play_Status_Minimum, Queue_Entry_Minimum } from '../graphql_type_helper';
import { FileManager } from '../useFileManager';
import { differenceInMilliseconds } from 'date-fns';

export class Track extends EventEmitter {
    private readonly _audio: HTMLAudioElement;
    private readonly _node: MediaElementAudioSourceNode;
    private readonly _localGain: GainNode;

    private _ready = false;

    constructor(
        private _status: Play_Status_Minimum,
        private readonly _ctx: AudioContext,
        private readonly _qe: Queue_Entry_Minimum,
        private readonly _fm: FileManager,
        destination: AudioNode,
    ) {
        super();

        this._audio = new Audio();
        this._audio.volume = 0;
        this._audio.loop = false;
        this._audio.autoplay = true;

        // this._audio.onloadedmetadata = this.onloadedmetadata.bind(this);
        this._audio.oncanplay = this.oncanplay.bind(this);
        this._audio.ontimeupdate = this.ontimeupdate.bind(this);

        const info = _fm.track(this._qe.file);

        this._audio.src = info.remoteUrl;
        info.data().then((blob) => {
            this._ready = false;
            this._audio.oncanplay = this.oncanplay.bind(this);
            this._audio.src = URL.createObjectURL(blob);
        });

        this._node = this._ctx.createMediaElementSource(this._audio);
        this._localGain = this._ctx.createGain();
        this._node.connect(this._localGain);
        this._localGain.connect(destination);
    }

    private oncanplay() {
        console.log('oncanplay triggered');
        this._ready = true;
        this.update(this._status);
        this._audio.oncanplay = null;
    }

    private ontimeupdate() {
        return;
        if (this._status.queue.length !== 1) return;

        // Provides a tight loop. 0.44 is an arbitrary amount that seems to work nicely for this end.
        if (this._audio.duration - this._audio.currentTime < 0.44) {
            this._audio.currentTime = 0;
        }
    }

    private _startTime = 0;
    private _endTime = 0;

    private getTimes(status: Play_Status_Minimum): {
        startTime: number;
        endTime: number;
        secondsIntoLoop: number;
        totalSeconds: number;
        myTurn: boolean;
    } {
        // TODO: Keep track of speed, too.
        const secondsSinceStart = differenceInMilliseconds(new Date(), status.start_timestamp) / 1000;
        let startTime = 0;
        let endTime = 0;
        let found = false;
        const totalSeconds = status.queue.reduce((prev, cur) => {
            if (cur.id === this._qe.id) {
                found = true;
                startTime = prev;
                endTime = prev + cur.file.length;
            }
            return prev + cur.file.length;
        }, 0);

        if (!found) {
            throw new Error("This track wasn't found in the current play status!");
        }

        const secondsIntoLoop = secondsSinceStart % totalSeconds;

        return {
            startTime,
            endTime,
            secondsIntoLoop,
            myTurn: startTime <= secondsIntoLoop && secondsIntoLoop <= endTime,
            totalSeconds,
        };
    }

    private onstart() {
        console.log('onstart called');
        if (this._audio.paused) {
            this._audio.play().catch((e) => {
                console.warn(e);
                this.emit('blocked', e);
            });
        }
        this.update(this._status);
    }

    private onend() {
        console.log('onend called');
        this.update(this._status);
    }

    private _stopTimeouts: (() => void) | null = null;

    public update(status: Play_Status_Minimum) {
        this._status = status;

        this._stopTimeouts?.();
        this._stopTimeouts = null;

        if (!this._ready) return;

        const times = this.getTimes(status);
        this._startTime = times.startTime;
        this._endTime = times.endTime;

        const nextStart = (times.startTime - times.secondsIntoLoop + times.totalSeconds) % times.totalSeconds;
        const nextEnd = (times.endTime - times.secondsIntoLoop + times.totalSeconds) % times.totalSeconds;

        if (times.myTurn) {
            if (this._audio.paused) {
                this._audio.play().catch((e) => {
                    console.warn(e);
                    this.emit('blocked', e);
                });
            }
            this._audio.volume = 1;
            const targetTime = times.secondsIntoLoop - times.startTime;
            if (Math.abs(this._audio.currentTime - targetTime) > 0.5) {
                // only update if we're off by more than half a second. Prevents skipping with
                // extra updates.
                this._audio.currentTime = targetTime;
            }
        } else {
            this._audio.volume = 0;
        }

        if (status.queue.length != 1) {
            const startHandle = setTimeout(this.onstart.bind(this), nextStart * 1000);
            const endHandle = setTimeout(this.onend.bind(this), nextEnd * 1000);
            this._stopTimeouts = () => {
                clearTimeout(startHandle);
                clearTimeout(endHandle);
            };
            console.log('Set timeouts: ', { nextStart, nextEnd });
        } else {
            const startHandle = setTimeout(this.onstart.bind(this), nextStart * 1000);
            this._stopTimeouts = () => {
                clearTimeout(startHandle);
            };
            console.log('Set timeouts: ', { nextStart });
        }
    }

    public destroy() {
        this._stopTimeouts?.();
        this._stopTimeouts = null;

        this._audio.pause();
        this._audio.src = '';
        this._node.disconnect();
        this._localGain.disconnect();
    }

    public async unblock() {
        try {
            await this._audio.play();
            this.update(this._status);
        } catch (e) {
            this.emit('blocked', e);
        }
    }
}
