import AudioGainPair from "./AudioGainPair";

async function getAudioFromFile(ctx: AudioContext, file: File, loop: boolean = true): Promise<AudioBufferSourceNode> {
    return new Promise(resolve => {
        let reader = new FileReader();
        reader.onload = async () => {
            if (!reader.result) throw Error("Couldn't read file " + file);

            let data = await ctx.decodeAudioData(reader.result as ArrayBuffer);
            resolve(new AudioBufferSourceNode(ctx, {buffer: data, loop}));
        };

        reader.readAsArrayBuffer(file);
    })
}

export default class AudioSet {
    balance: boolean;

    readonly files: string[];
    readonly pairs: AudioGainPair[];
    readonly defaultFade: number;

    private _paused: boolean = false;
    private readonly _selected: Set<number>;

    constructor(private readonly context: AudioContext, files = [], pairs = [], defaultFade = 1.875, balance = false) {
        this.files = files;
        this.pairs = pairs;
        this._selected = new Set();
        this.balance = balance;
        this.defaultFade = defaultFade;
    }

    get duration(): number {
        return this.pairs[0].audioNode.buffer!!.duration;
    }

    get playedTime(): number | null {
        return this.pairs[0].playedTime;
    }

    get currentSelected(): Iterable<number> {
        let out = new Set<number>();
        for (let sel of this._selected) {
            out.add(sel);
        }
        return out;
    }

    set currentSelected(values: Iterable<number>) {
        for (let selected of this.currentSelected) {
            this.cutOut(selected);
        }

        if (!values) return;
        for (let value of values) {
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
            let vol = this.getNextVolume(this.numEnabled);
            for (let id of this._selected) {
                let pair = this.pairs[id];
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
        for (let id of this.currentSelected) {
            this.cutOut(id);
        }
        this.cutIn(next);
    }

    cutIn(id?: number, when?: number): void {
        if (id === undefined) {
            for (let id of this.currentSelected) {
                this.cutOut(id, when);
            }
            return;
        }

        let pair = this.pairs[id];

        if (when === undefined) {
            when = pair.context.currentTime;
        }

        let vol = this.getNextVolume(this.numEnabled + 1);
        pair.gain.setValueAtTime(vol, when);

        this._selected.add(id);
    }

    cutOut(id?: number, when?: number): void {
        if (id === undefined) {
            for (let id of this.currentSelected) {
                this.cutOut(id, when);
            }
            return;
        }

        let pair = this.pairs[id];
        if (when === undefined) {
            when = pair.context.currentTime;
        }
        pair.gain.setValueAtTime(0, when);

        this._selected.delete(id);
    }

    fadeTo(next: number, fadeTime: number = this.defaultFade): void {
        for (let id of this.currentSelected) {
            this.fadeOut(id, undefined, fadeTime);
        }

        this.fadeIn(next, undefined, fadeTime);
    }

    fadeIn(id: number, when?: number, fadeTime: number = this.defaultFade): void {
        if (!this.isPlaying(id)) {
            let pair = this.pairs[id];

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
            for (let id of this.currentSelected) {
                this.fadeOut(id, when, fadeTime);
            }
            return;
        }

        if (this.isPlaying(id)) {
            let pair = this.pairs[id];

            if (when === undefined) {
                when = pair.context.currentTime;
            }

            pair.gain.cancelScheduledValues(when);
            pair.gain.setValueAtTime(pair.gain.value, when);
            pair.gain.linearRampToValueAtTime(0, when + fadeTime);
            this._selected.delete(id);
        }
    }

    start(when?: number, offset?: number) {
        for (let pair of this.pairs) {
            pair.start(when, offset);
        }
    }

    async pause() {
        this._paused = true;
        await this.context.suspend();
    }

    async resume() {
        this._paused = false;
        await this.context.resume();
    }

    close() {
        this.context.close();
    }

    get paused(): boolean {
        return this._paused;
    }

    static async fromFileList(ctx: AudioContext, fileList: FileList, defaultFade: number = 1.875, balance: boolean = false, output: AudioNode = ctx.destination): Promise<AudioSet> {
        let aset = new AudioSet(ctx, [], [], defaultFade, balance);
        let processing = [];

        for (let file of fileList) {
            aset.files.push(file.name);
            processing.push(getAudioFromFile(ctx, file));
        }

        let sources = await Promise.all(processing);

        for (let source of sources) {
            aset.pairs.push(new AudioGainPair(ctx, source));
        }

        for (let pair of aset.pairs) {
            pair.gainNode.connect(output);
            pair.gain.setValueAtTime(0, ctx.currentTime);
        }

        return aset;
    }
}