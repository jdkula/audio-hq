/**
 * track.ts
 * =========
 * Provides an audio player for a single track that reconciles the
 * HTMLAudioElement towards a given database Track
 */
import { EventEmitter } from 'events';
import { Deck_Minimum, Track_Minimum } from '../urql/graphql_type_helper';
import { FileManager } from '../useWorkspaceDetails';
import { shouldCacheLRV } from '../sw_client';
import { globalVolumeLRV } from '../utility/usePersistentData';
import { getTimes } from './util';
import { kMaxAudioDriftAllowance } from '../constants';

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
        this._audio.preload = 'auto';
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

        const times = getTimes(status, this._qe);

        const nextStart = (times.startTime - times.secondsIntoLoop + times.totalSeconds) % times.totalSeconds;
        const nextEnd = (times.endTime - times.secondsIntoLoop + times.totalSeconds) % times.totalSeconds;

        if (times.myTurn && !status.pause_timestamp && globalVolumeLRV.value !== 0) {
            if (this._audio.paused) {
                this._audio.play().catch((e) => {
                    console.warn(e);
                    this.emit('blocked', e);
                });
            }
            const targetTime = (times.secondsIntoLoop - times.startTime) * this._status.speed;
            if (Math.abs(this._audio.currentTime - targetTime) > kMaxAudioDriftAllowance) {
                // only update if we're off by more than 3/2 a second. Prevents skipping with
                // extra updates.
                this._audio.currentTime = targetTime;
            }
            this._audio.volume = this._status.volume * globalVolumeLRV.value;
            this._audio.playbackRate = this._status.speed;
        } else {
            this._audio.volume = 0;
            if (!this._audio.paused) {
                this._audio.pause();
            }
        }

        if (status.queue.length !== 1) {
            const startHandle = setTimeout(this.onstart.bind(this), nextStart * 1000);
            const endHandle = setTimeout(this.onend.bind(this), nextEnd * 1000);
            this._stopTimeouts = () => {
                clearTimeout(startHandle);
                clearTimeout(endHandle);
            };
        } else {
            const startHandle = setTimeout(this.onstart.bind(this), nextStart * 1000);
            this._stopTimeouts = () => {
                clearTimeout(startHandle);
            };
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
