import { FileManager } from '../useFileManager';
import { getTrackInfo } from '../utility';
import _ from 'lodash';
import { Play_Status_Minimum } from '../graphql_type_helper';
import { EventEmitter } from 'events';

export class Track extends EventEmitter {
    private _fm: FileManager;
    private readonly _status: Play_Status_Minimum;

    private readonly _media: HTMLMediaElement;
    private readonly _node: AudioNode;
    private readonly _gain: GainNode;

    private _curQueueIdx = 0;

    constructor(state: Play_Status_Minimum, fm: FileManager, ctx: AudioContext, loop = true) {
        super();

        console.log('<<constructor running>>');
        this._fm = fm;
        this._status = state;

        const track = getTrackInfo(state, 0);
        if (!track) throw new Error("No track found, but we're loading one??");

        this._curQueueIdx = 0;
        const info = fm.track(track.file);
        info.data.then((blob) => (this._media.src = URL.createObjectURL(blob)));

        this._media = new Audio(info.remoteUrl);
        this._node = ctx.createMediaElementSource(this._media);
        this._gain = ctx.createGain();
        this._node.connect(this._gain);
        console.log(this._media);
        console.log(this._node);

        this._media.preload = 'auto';

        let isTransitioning = false;

        this._media.onloadstart = () => {
            console.log('audio.current.onloadstart called');
        };

        this._media.onloadedmetadata = () => {
            console.log('audio.current.onloadedmetadata called');
            const inf = getTrackInfo(this._status, this._curQueueIdx);
            if (!inf) {
                return;
            }
            this._media.currentTime = inf.duration;
        };

        this._media.oncanplay = () => {
            console.log('audio.current.oncanplay called');
            if (!this._status.pause_timestamp) {
                isTransitioning = false;
                console.log('Playing', this._media);
                this._media.play().catch((e) => {
                    console.log('Blocked', e);
                    this.emit('blocked');
                });
            }
        };

        this._media.onended = () => {
            if (!loop) {
                this.emit('end');
            }
        };

        this._media.loop = loop && this._status.queue.length === 1;
        this._media.ontimeupdate = () => {
            // 0.44 is an arbitrary buffer time where timeupdate will be able to seek before hitting the end.
            if (this._media.duration - this._media.currentTime < 0.44 && !isTransitioning && loop) {
                console.log('Looping/ending');
                if (this._status.queue.length === 1) {
                    this.emit('loop');
                    this._media.currentTime = 0;
                } else if (state.queue.length > 1) {
                    this._curQueueIdx++;
                    console.log('Moving to next file', this._curQueueIdx);
                    const track = getTrackInfo(this._status, this._curQueueIdx);
                    if (!track) throw new Error('Tried to get next index, failed');
                    isTransitioning = true;
                    const assign = () => {
                        console.log('Assigning source now', this._curQueueIdx);
                        const info = fm.track(track.file);
                        info.data.then((blob) => (this._media.src = URL.createObjectURL(blob)));

                        this._media.src = info.remoteUrl;
                        this.emit('next');
                    };
                    if (track.duration < 0) {
                        window.setTimeout(assign, -track.duration * 1000);
                    } else {
                        assign();
                    }
                }
            }
        };

        this._gain.gain.value = state.volume;
        this._media.playbackRate = state.speed;
    }

    connect(node: AudioNode) {
        this._gain.connect(node);
    }

    play() {
        this._media.play().catch((e) => console.warn(e));
    }

    pause() {
        this._media.pause();
    }

    isReferentFor(state: Play_Status_Minimum): boolean {
        return (
            state.queue.length === this._status.queue.length &&
            this._status.queue.every((id, idx) => id === state.queue[idx])
        );
    }

    reconcile(newState: Play_Status_Minimum): boolean {
        if (!this.isReferentFor(newState)) return false;

        this._status.volume = newState.volume;
        this._gain.gain.value = newState.volume;

        this._status.speed = newState.speed;
        this._media.playbackRate = newState.speed;

        this._status.start_timestamp = newState.start_timestamp;
        this._status.pause_timestamp = newState.pause_timestamp;
        if (this._status.pause_timestamp && !this._media.paused) {
            this._media.pause();
        } else if (!this._status.pause_timestamp && this._media.paused) {
            this._media.play().catch((e) => console.warn(e));
        }
        const inf = getTrackInfo(this._status);
        if (!inf) {
            return false;
        }

        this._media.currentTime = inf.duration;
        if (this._status.queue[this._curQueueIdx % this._status.queue.length].file.id !== inf.file.id) {
            this._curQueueIdx = this._status.queue.findIndex((entry) => entry.file.id === inf.file.id);
            const info = this._fm.track(inf.file);
            info.data.then((blob) => (this._media.src = URL.createObjectURL(blob)));

            this._media.src = info.remoteUrl;
        }

        return _.isEqual(this._status, newState);
    }

    rereconcile(): boolean {
        return this.reconcile(this._status);
    }

    destroy() {
        console.log('Destroying...');
        this._node.disconnect();
        this._media.pause();
        this._media.src = '';
        this.removeAllListeners();
    }
}
