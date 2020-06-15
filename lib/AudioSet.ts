import AudioGainPair from "./AudioGainPair";

async function getAudioFromBlob(ctx: AudioContext, blob: Blob, loop = true): Promise<AudioBufferSourceNode> {
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

export default class AudioSet {
    balance: boolean;

    readonly pairs: AudioGainPair[];
    readonly defaultFade: number;

    private _paused = false;
    private readonly _selected: Set<number>;

    constructor(private readonly context: AudioContext, pairs = [], defaultFade = 1.875, balance = false) {
        this.pairs = pairs;
        this._selected = new Set();
        this.balance = balance;
        this.defaultFade = defaultFade;
    }

    get duration(): number {
        const duration = this.pairs[0].audioNode.buffer?.duration;
        if (!duration) throw new Error("Could not get duration!");
        return duration;
    }

    get playedTime(): number | null {
        return this.pairs[0].playedTime;
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
        return this.pairs.length;
    }

    get numEnabled(): number {
        return this._selected.size;
    }

    isPlaying(id: number): boolean {
        return this._selected.has(id);
    }

    getNextVolume(num: number): number {
        if (!this.balance) {
            return 1;
        }
        if (num === 0) return 0;
        return 1 / num;
    }

    doBalance(fadeTime: number | null = null): void {
        if (this.balance) {
            const vol = this.getNextVolume(this.numEnabled);
            for (const id of this._selected) {
                const pair = this.pairs[id];
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

        const pair = this.pairs[id];

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

        const pair = this.pairs[id];
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
            const pair = this.pairs[id];

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
            const pair = this.pairs[id];

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
        for (const pair of this.pairs) {
            pair.start(when, offset);
        }
    }

    async pause(): Promise<void> {
        this._paused = true;
        await this.context.suspend();
    }

    async resume(): Promise<void> {
        this._paused = false;
        await this.context.resume();
    }

    close(): void {
        this.context.close();
    }

    get paused(): boolean {
        return this._paused;
    }

    static async fromBlobs(
        ctx: AudioContext,
        blobList: Iterable<Blob>,
        defaultFade = 1.875,
        balance = false,
        output: AudioNode = ctx.destination,
    ): Promise<AudioSet> {
        const aset = new AudioSet(ctx, [], defaultFade, balance);
        const processing = [];

        for (const blob of blobList) {
            processing.push(getAudioFromBlob(ctx, blob));
        }

        const sources = await Promise.all(processing);

        for (const source of sources) {
            aset.pairs.push(new AudioGainPair(ctx, source));
        }

        for (const pair of aset.pairs) {
            pair.gainNode.connect(output);
            pair.gain.setValueAtTime(0, ctx.currentTime);
        }

        return aset;
    }
}
