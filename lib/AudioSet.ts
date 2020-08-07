import { AudioGainPair } from './AudioGainPair';
import { Player } from './Player';

async function blobToBuffer(ctx: BaseAudioContext, blob: Blob): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
            if (!reader.result) throw Error("Couldn't read file " + blob);

            ctx.decodeAudioData(
                reader.result as ArrayBuffer,
                (data) => {
                    resolve(data);
                },
                (err) => {
                    reject(err);
                },
            );
        };

        reader.readAsArrayBuffer(blob);
    });
}

export class AudioSet implements Player {
    balance: boolean;
    readonly defaultFade: number;

    private _pairs: AudioGainPair[] = [];

    private _paused = false;
    private _buffers: AudioBuffer[] = [];
    private _selected: Set<number>;

    private _volume = 1;

    private _output: AudioNode | null = null;

    private _startTime = 0;

    constructor(buffers: AudioBuffer[] = [], defaultFade = 1.875, balance = false) {
        this._buffers = buffers;
        this._selected = new Set();
        this.balance = balance;
        this.defaultFade = defaultFade;
    }

    static async audioSet(
        context: BaseAudioContext,
        blobs: Blob[] = [],
        defaultFade = 1.875,
        balance = false,
    ): Promise<AudioSet> {
        const processing = [];

        for (const blob of blobs) {
            processing.push(blobToBuffer(context, blob));
        }

        const buffers = await Promise.all(processing);

        return new AudioSet(buffers, defaultFade, balance);
    }

    get size(): number {
        return this._pairs.length;
    }

    reset(): void {
        // assumes new audiocontext/old audio context was closed.
        this._pairs = [];
        this._selected = new Set();
    }

    async connect(node: AudioNode, when?: number, offset?: number): Promise<void> {
        this._output = node;

        this._pairs = [];

        const context = node.context;

        for (const buffer of this._buffers) {
            const source = context.createBufferSource();
            source.buffer = buffer;
            source.loop = true;
            this._pairs.push(new AudioGainPair(context, source));
        }

        for (const pair of this._pairs) {
            pair.gainNode.connect(node);
            pair.gain.setValueAtTime(0, node.context.currentTime);
        }

        this.start(when, offset);
    }

    get duration(): number {
        const duration = this._pairs[0]?.audioNode.buffer?.duration ?? 0;
        return duration;
    }

    get playedTime(): number {
        if (this.duration === 0) return 0;
        return ((this._output?.context.currentTime ?? 0) - this._startTime) % this.duration;
    }

    seek(to?: number): number {
        // TODO: ability to seek TO a time.
        const now = this.playedTime;

        if (to !== undefined && this._output) {
            this.stop();
            this.connect(this._output, undefined, to);
            this.cutIn();
        }

        return now;
    }

    volume(vol?: number): number {
        if (vol !== undefined) {
            this._volume = vol;
            this.doBalance();
        }

        return this._volume;
    }

    get currentSelected(): Iterable<number> {
        const out = new Set<number>();
        for (const sel of this._selected) {
            out.add(sel);
        }
        return out;
    }

    set currentSelected(values: Iterable<number>) {
        for (const selected of this.currentSelected) {
            this.cutOut(selected);
        }

        if (!values) return;
        for (const value of values) {
            this.cutIn(value);
        }
    }

    get numOptions(): number {
        return this._pairs.length;
    }

    get numEnabled(): number {
        return this._selected.size;
    }

    isPlaying(id: number): boolean {
        return this._selected.has(id);
    }

    getNextVolume(num: number): number {
        if (!this.balance) {
            return this._volume;
        }
        if (num === 0) return 0;
        return this._volume / num;
    }

    doBalance(fadeTime: number | null = null): void {
        if (this.balance) {
            const vol = this.getNextVolume(this.numEnabled);
            for (const id of this._selected) {
                const pair = this._pairs[id];
                if (fadeTime !== null) {
                    pair.gain.setValueAtTime(pair.gain.value, pair.context.currentTime);
                    pair.gain.cancelScheduledValues(pair.context.currentTime + 0.001);
                    pair.gain.linearRampToValueAtTime(vol, pair.context.currentTime + fadeTime);
                } else {
                    pair.gain.setValueAtTime(vol, pair.context.currentTime);
                }
            }
        }
    }

    cutTo(next: number): void {
        for (const id of this.currentSelected) {
            this.cutOut(id);
        }
        this.cutIn(next);
    }

    cutIn(id?: number, when?: number): void {
        if (id === undefined) {
            for (const id of this.currentSelected) {
                this.cutIn(id, when);
            }
            return;
        }

        const pair = this._pairs[id];

        if (when === undefined) {
            when = pair.context.currentTime;
        }

        const vol = this.getNextVolume(this.numEnabled + 1);
        pair.gain.setValueAtTime(vol, when);

        this._selected.add(id);
    }

    cutOut(id?: number, when?: number): void {
        if (id === undefined) {
            for (const id of this.currentSelected) {
                this.cutOut(id, when);
            }
            return;
        }

        const pair = this._pairs[id];
        if (when === undefined) {
            when = pair.context.currentTime;
        }
        pair.gain.setValueAtTime(0, when);

        this._selected.delete(id);
    }

    fadeTo(next: number, fadeTime: number = this.defaultFade): void {
        for (const id of this.currentSelected) {
            this.fadeOut(id, undefined, fadeTime);
        }

        this.fadeIn(next, undefined, fadeTime);
    }

    fadeIn(id?: number, when?: number, fadeTime: number = this.defaultFade): void {
        if (id === undefined) {
            for (const id of this.currentSelected) {
                this.fadeIn(id, when, fadeTime);
            }
            return;
        }

        if (!this.isPlaying(id)) {
            const pair = this._pairs[id];

            if (when === undefined) {
                when = pair.context.currentTime;
            }

            pair.gain.cancelScheduledValues(when);
            pair.gain.setValueAtTime(pair.gain.value, when);
            pair.gain.linearRampToValueAtTime(1, when + fadeTime);
            this._selected.add(id);
        }
    }

    fadeOut(id?: number, when?: number, fadeTime: number = this.defaultFade): void {
        if (id === undefined) {
            for (const id of this.currentSelected) {
                this.fadeOut(id, when, fadeTime);
            }
            return;
        }

        if (this.isPlaying(id)) {
            const pair = this._pairs[id];

            if (when === undefined) {
                when = pair.context.currentTime;
            }

            pair.gain.cancelScheduledValues(when);
            pair.gain.setValueAtTime(pair.gain.value, when);
            pair.gain.linearRampToValueAtTime(0, when + fadeTime);
            this._selected.delete(id);
        }
    }

    start(when?: number, offset?: number): void {
        this._startTime = (this._output?.context.currentTime ?? 0) + (when ?? 0) - (offset ?? 0);
        for (const pair of this._pairs) {
            pair.start(when, offset);
        }
    }

    stop(when?: number): void {
        for (const pair of this._pairs) {
            pair.stop(when);
        }
    }

    async pause(): Promise<void> {
        this._paused = true;
        // relies completely on context, can't pause here.
    }

    async play(): Promise<void> {
        this._paused = false;
        // relies completely on context, can't pause here.
    }

    close(): void {
        throw new Error('Closing AudioSet!!!');
        // nothing to do.
    }

    get paused(): boolean {
        return this._paused;
    }
}
