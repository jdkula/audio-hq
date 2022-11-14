/**
 * track.ts
 * =========
 * Provides an audio player for a single track that reconciles the
 * HTMLAudioElement towards a given database Track
 */
import { EventEmitter } from 'events';
import { FileManager } from '../useWorkspaceDetails';
import { shouldCacheLRV } from '../sw_client';
import { globalVolumeLRV } from '../utility/usePersistentData';
import { getDeckInfo } from './audio_util';
import { kMaxAudioDriftAllowance } from '../constants';

import * as API from '../api/models';

export class Track extends EventEmitter {
    private readonly _audio: HTMLAudioElement;

    private _ready = false;

    private readonly _globalVolumeListener: () => void;

    constructor(private _status: API.Deck, private readonly _qe: API.Single, private readonly _fm: FileManager) {
        super();

        this._audio = new Audio();
        this._audio.crossOrigin = 'anonymous';
        this._audio.volume = 0;
        this._audio.loop = false;
        this._audio.preload = 'auto';
        this._audio.autoplay = true;

        this.once('internal_audioplayable', this.oncanplay.bind(this));
        this._audio.oncanplay = () => this.emit('internal_audioplayable');

        this._audio.src = this._qe.url;

        if (shouldCacheLRV.value) {
            this._fm.download(this._qe);
        }

        this._globalVolumeListener = () => this.update(this._status);
        globalVolumeLRV.on('set', this._globalVolumeListener);
    }

    private oncanplay() {
        this._ready = true;
        this.update(this._status);
    }

    private onstart() {
        if (this._audio.paused) {
            this._audio.play().catch((e) => {
                console.warn(e);
                this.emit('blocked', e);
            });
        }
        this.update(this._status);
    }

    private onend() {
        this.update(this._status);
    }

    private _stopTimeouts: (() => void) | null = null;

    public update(status: API.Deck) {
        this._status = status;

        this._stopTimeouts?.();
        this._stopTimeouts = null;

        if (!this._ready) return;

        const deckInfo = getDeckInfo(status, this._qe);

        if (!deckInfo) {
            this._audio.pause();
            return;
        }

        const { trackInfo, ...times } = deckInfo;

        // Stop SFX after time.
        if (status.type === 'sfx' && times.secondsToCurrentPlayhead > times.totalSeconds) {
            this._audio.pause();
            return;
        }

        const nextStart = (trackInfo.startTime - times.secondsIntoLoop + times.totalSeconds) % times.totalSeconds;
        const nextEnd = (trackInfo.endTime - times.secondsIntoLoop + times.totalSeconds) % times.totalSeconds;

        if (trackInfo.isCurrent && !status.pauseTimestamp && globalVolumeLRV.value !== 0) {
            if (this._audio.paused) {
                this._audio.play().catch((e) => {
                    console.warn(e);
                    this.emit('blocked', e);
                });
            }
            const targetTime = (times.secondsIntoLoop - trackInfo.startTime) * this._status.speed;
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
            console.warn(e);
            this.emit('blocked', e);
        }
    }
}
