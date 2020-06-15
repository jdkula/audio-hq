export default class AudioGainPair {
    readonly gainNode: GainNode;
    readonly audioNode: AudioBufferSourceNode;

    private _startTime: number | null = null;

    constructor(ctx: AudioContext, audioBufferSourceNode: AudioBufferSourceNode) {
        this.gainNode = ctx.createGain();
        this.audioNode = audioBufferSourceNode;
        this.audioNode.connect(this.gainNode);
    }

    start(when?: number, offset?: number, duration?: number) {
        this._startTime = this.context.currentTime;
        this.audioNode.start(when, offset, duration);
    }

    get playedTime(): number | null {
        if (this._startTime === null) return null;

        return this.context.currentTime - this._startTime;
    }

    get gain(): AudioParam {
        return this.gainNode.gain;
    }

    get context(): BaseAudioContext {
        return this.gainNode.context;
    }
}
