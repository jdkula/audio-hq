import AudioGainPair from "./AudioGainPair";
import { Player } from "./Player";

async function getAudioFromBlob(ctx: BaseAudioContext, blob: Blob, loop = true): Promise<AudioBufferSourceNode> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async () => {
            if (!reader.result) throw Error("Couldn't read file " + blob);

            const data = await ctx.decodeAudioData(reader.result as ArrayBuffer);
            resolve(new AudioBufferSourceNode(ctx, { buffer: data, loop }));
        };

        reader.readAsArrayBuffer(blob);
    });
}

export default class AudioSet implements Player {
    balance: boolean;
    readonly defaultFade: number;

    private _pairs: AudioGainPair[] = [];

    private _paused = false;
    private _blobs: Blob[] = [];
    private _selected: Set<number>;

    private _volume = 1;

    constructor(blobs: Blob[] = [], defaultFade = 1.875, balance = false) {
        this._blobs = blobs;
        this._selected = new Set();
        this.balance = balance;
        this.defaultFade = defaultFade;
    }

    get size(): number {
        return this._pairs.length;
    }

    reset(): void {
        // assumes new audiocontext/old audio context was closed.
        this._pairs = [];
        this._selected = new Set();
    }

    async connect(node: AudioNode): Promise<void> {
        const processing = [];

        for (const blob of this._blobs) {
            processing.push(getAudioFromBlob(node.context, blob));
        }

        const sources = await Promise.all(processing);

        for (const source of sources) {
            const pair = new AudioGainPair(node.context, source);
            pair.gainNode.connect(node);
            this._pairs.push(pair);
        }

        for (const pair of this._pairs) {
            pair.gain.setValueAtTime(0, node.context.currentTime);
        }

        this.start();
    }

    get duration(): number {
        const duration = this._pairs[0].audioNode.buffer?.duration;
        if (!duration) throw new Error("Could not get duration!");
        return duration;
    }

    seek(to?: number): number {
        // TODO: ability to seek TO a time.
        const now = this._pairs[0].playedTime;
        if (!now) throw new Error("Couldn't get seek value from AudioSet!");

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
                this.cutOut(id, when);
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

    fadeIn(id: number, when?: number, fadeTime: number = this.defaultFade): void {
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
        for (const pair of this._pairs) {
            pair.start(when, offset);
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
        // nothing to do.
    }

    get paused(): boolean {
        return this._paused;
    }
}
