import { EventEmitter } from 'events';
import { Deck_Minimum, Track_Minimum } from '../graphql_type_helper';
import { FileManager } from '../useFileManager';
import { differenceInMilliseconds } from 'date-fns';
import { shouldCacheLRV, globalVolumeLRV } from '../global_lrv';

export class Track extends EventEmitter {
    private readonly _audio: HTMLAudioElement;

    private _ready = false;

    private readonly _globalVolumeListener: () => void;

    constructor(private _status: Deck_Minimum, private readonly _qe: Track_Minimum, private readonly _fm: FileManager) {
        super();

        this._audio = new Audio();
        this._audio.crossOrigin = 'anonymous';
        this._audio.volume = 0;
        this._audio.loop = false;
        this._audio.autoplay = true;

        this.once('internal_audioplayable', this.oncanplay.bind(this));
        this._audio.oncanplay = () => this.emit('internal_audioplayable');

        this._audio.src = this._qe.file.download_url;

        if (shouldCacheLRV.value) {
            this._fm.download(this._qe.file);
        }

        this._globalVolumeListener = () => this.update(this._status);
        globalVolumeLRV.on('set', this._globalVolumeListener);
    }

    private oncanplay() {
        console.log('oncanplay triggered');
        this._ready = true;
        this.update(this._status);
    }

    private _startTime = 0;
    private _endTime = 0;

    private getTimes(status: Deck_Minimum): {
        startTime: number;
        endTime: number;
        secondsIntoLoop: number;
        totalSeconds: number;
        myTurn: boolean;
    } {
        // TODO: Keep track of speed, too.
        const secondsSinceStart = differenceInMilliseconds(new Date(), new Date(status.start_timestamp)) / 1000;
        let startTime = 0;
        let endTime = 0;
        let found = false;
        const totalSeconds = status.queue.reduce((prev, cur) => {
            if (cur.id === this._qe.id) {
                found = true;
                startTime = prev;
                endTime = prev + cur.file.length / status.speed;
            }
            return prev + cur.file.length / status.speed;
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

    public update(status: Deck_Minimum) {
        this._status = status;

        this._stopTimeouts?.();
        this._stopTimeouts = null;

        if (!this._ready) return;

        const times = this.getTimes(status);
        this._startTime = times.startTime;
        this._endTime = times.endTime;

        const nextStart = (times.startTime - times.secondsIntoLoop + times.totalSeconds) % times.totalSeconds;
        const nextEnd = (times.endTime - times.secondsIntoLoop + times.totalSeconds) % times.totalSeconds;

        if (times.myTurn && !status.pause_timestamp) {
            if (this._audio.paused) {
                this._audio.play().catch((e) => {
                    console.warn(e);
                    this.emit('blocked', e);
                });
            }
            const targetTime = (times.secondsIntoLoop - times.startTime) * this._status.speed;
            if (Math.abs(this._audio.currentTime - targetTime) > 1.5) {
                // only update if we're off by more than 3/2 a second. Prevents skipping with
                // extra updates.
                this._audio.currentTime = targetTime;
            }
            this._audio.volume = this._status.volume * globalVolumeLRV.value;
            this._audio.playbackRate = this._status.speed;
        } else {
            this._audio.volume = 0;
        }

        if (status.queue.length !== 1) {
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
            console.log('Set timeouts: ', { nextStart, status });
        }
    }

    public destroy() {
        this._stopTimeouts?.();
        this._stopTimeouts = null;

        this._audio.pause();
        this._audio.src = '';
        globalVolumeLRV.off('set', this._globalVolumeListener);
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
