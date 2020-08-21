import { AudioGainPair } from './AudioGainPair';

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

async function blobsToBuffers(ctx: BaseAudioContext, ...blobs: Blob[]): Promise<AudioBuffer[]> {
    const processing = [];

    for (const blob of blobs) {
        processing.push(blobToBuffer(ctx, blob));
    }

    const buffers = await Promise.all(processing);

    return buffers;
}

export class AudioSet {
    balance: boolean;
    defaultFade: number;

    private _pairs: AudioGainPair[] = [];

    private _pauseTime: number | null = null;
    private _buffers: AudioBuffer[] = [];
    private _selected: Set<number>;

    private _volume = 1;

    private _output: AudioNode | null = null;

    private _startTime: number | null = null;

    constructor(defaultFade = 1.875, balance = false) {
        this._buffers = [];
        this._selected = new Set();
        this.balance = balance;
        this.defaultFade = defaultFade;
    }

    get size(): number {
        return this._pairs.length;
    }

    reset(): void;
    async reset(node?: AudioNode, blobs?: Blob[]): Promise<void>;
    async reset(node?: AudioNode, blobs?: Blob[]): Promise<void> {
        if (Array.isArray(blobs) && !node) {
            throw Error('Must provide new node if giving new blobs');
        } else if (Array.isArray(blobs) && node) {
            this._output = node;
            this._buffers = await blobsToBuffers(node.context, ...blobs);
            this._startTime = null;
            this._pauseTime = null;
            console.log('Got buffers');
        }

        if (!this._output) return;

        console.log('Stopping...');
        this.stop();

        this._pairs = [];

        const context = this._output.context;

        console.log('Linking');
        for (const buffer of this._buffers) {
            const source = context.createBufferSource();
            source.buffer = buffer;
            source.loop = true;
            this._pairs.push(new AudioGainPair(context, source));
        }

        for (const pair of this._pairs) {
            pair.gainNode.connect(this._output);
            pair.gain.setValueAtTime(0, context.currentTime);
        }

        if (this._pairs.length > 0) {
            this._selected.add(0);
        }

        console.log(this);
    }

    async connect(node: AudioNode, when?: number, offset?: number): Promise<void> {
        this._output = node;

        this.reset();

        this.start(when, offset);
    }

    get duration(): number {
        const duration = this._pairs[0]?.audioNode.buffer?.duration ?? 0;
        return duration;
    }

    get playedTime(): number {
        if (this.duration === 0) return 0;
        if (!this._startTime) return 0;
        return ((this._pauseTime ?? this._output?.context.currentTime ?? 0) - this._startTime) % this.duration;
    }

    // to: number of seconds into the song.
    seek(to?: number): number {
        // TODO: ability to seek TO a time.
        const now = this.playedTime;

        if (this._pauseTime !== null && to !== undefined) {
            this._pauseTime = to;
            return now;
        }

        if (to !== undefined && this._output) {
            this.reset();
            this.start(undefined, to);
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
        this._pauseTime = null;
        this._startTime = (this._output?.context.currentTime ?? 0) + (when ?? 0) - (offset ?? 0);
        this.cutIn();
        for (const pair of this._pairs) {
            pair.start(when, offset);
        }
    }

    stop(): void {
        for (const pair of this._pairs) {
            pair.stop();
        }
        this._pairs = [];
        this._selected.clear();
    }

    async pause(): Promise<void> {
        this._pauseTime = this.playedTime;
        this.stop();
        // relies completely on context, can't pause here.
    }

    play(): void {
        if (this._pauseTime === null || this._startTime === null) {
            this.reset();
            this.start();
            return;
        }

        this.reset();
        this.cutIn();
        this.start(undefined, Math.max(this._pauseTime, 0));
        this._startTime += this._pauseTime;
        this._pauseTime = null;
    }

    close(): void {
        throw new Error('Closing AudioSet!!!');
        // nothing to do.
    }

    get paused(): boolean {
        return this._pauseTime !== null;
    }
}
