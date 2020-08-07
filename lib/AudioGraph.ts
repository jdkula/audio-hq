import { AudioSet } from './AudioSet';
import { PlayState } from './Workspace';
import { Player } from './Player';
import { WorkspaceRetriever } from './WorkspaceRetriever';
import { applyUpdate } from './Utility';
import { useState, useEffect } from 'react';

interface Main {
    context: AudioContext;
    gain: GainNode;
    set: AudioSet | null;
}

interface Ambient {
    context: AudioContext;
    gain: GainNode;
    set: Set<MediaElementAudioSourceNode>;
}

interface SFX {
    context: AudioContext;
    gain: GainNode;
    set: Set<MediaElementAudioSourceNode>;
}

class AudioElementAdapter implements Player {
    play(): void {}

    pause(): void {}

    seek(to?: number): number {
        return 0;
    }

    volume(vol?: number): number {
        return 0;
    }

    get duration(): number {
        return 0;
    }

    async connect(node: AudioNode): Promise<void> {}

    reset(): void {}
}

class AudioEngine<T extends Player> {
    private _context: AudioContext;
    private _mainGain: GainNode;
    private _volume = 1;
    private _paused = true;
    private readonly _players: T[] = [];
    constructor(players: T | T[] = []) {
        window.AudioContext = window.AudioContext || (window as any).webkitAudioContext;

        this._context = new AudioContext();
        this._context.suspend();
        this._mainGain = this._context.createGain();

        this._mainGain.connect(this._context.destination);

        if (!Array.isArray(players)) {
            players = [players];
        }

        for (const player of players) {
            this.addPlayer(player);
        }
    }

    get context(): AudioContext {
        return this._context;
    }

    get paused() {
        return this._paused;
    }

    player(id = 0): T | null {
        return this._players[id] ?? null;
    }

    async addPlayer(player: T): Promise<T> {
        this._players.push(player);
        await player.connect(this._mainGain);
        if (this.paused) {
            this._context.suspend();
        }
        return player;
    }

    playAll(): void {
        this._paused = false;
        this._context.resume();
        for (const player of this._players) {
            player.play();
        }
    }

    pauseAll(): void {
        this._paused = true;
        this._context.suspend();
        for (const player of this._players) {
            player.pause();
        }
    }

    masterVolume(vol?: number): number {
        const oldVol = this._volume;
        if (vol) {
            this._volume = vol;
            const currentTime = this._context.currentTime;
            this._mainGain.gain.setValueAtTime(vol, currentTime);
        }

        return oldVol;
    }

    async close() {
        await this._context.close();
        for (const player of this._players) {
            player.reset();
        }
        this._players.splice(0);
    }

    async reset() {
        await this.close();
        this._context = new AudioContext();
        this._mainGain = this._context.createGain();
        this._mainGain.gain.setValueAtTime(this._volume, this._context.currentTime);
        this._mainGain.connect(this._context.destination);
    }
}

export class AudioGraph {
    private static _instance: AudioGraph | null = null;
    public readonly main: AudioEngine<AudioSet> = new AudioEngine();
    private _mainState: PlayState | null = null;
    private _ambient: AudioEngine<AudioElementAdapter> = new AudioEngine();
    private _sfx: AudioEngine<AudioElementAdapter> = new AudioEngine();

    private constructor() {}

    playAmbient(): void {
        // TODO: Add ambient music!
    }

    async playMain(playState: Partial<PlayState | null>, retriever: WorkspaceRetriever, force = false): Promise<void> {
        // TODO: Reconcile, e.g. only pause or play.

        // const newState = applyUpdate(this._mainState, playState);

        if (!force && playState !== null && (!playState.id || playState.id === this._mainState?.id)) {
            if (playState.paused) {
                this.main.pauseAll();
            } else {
                this.main.playAll();
                const aset = this.main.player(0);
                if (aset) {
                    for (let i = 0; i < aset.size; i++) {
                        aset.fadeIn(i);
                    }
                }
            }

            if (playState.timestamp) {
                this.main.player(0)?.seek(playState.timestamp);
            }

            this.main.masterVolume(playState.volume);

            this._mainState = JSON.parse(JSON.stringify(playState));
            // TODO: Timestamp, volume.
            return;
        }

        await this.main.reset();

        if (!playState) return; // nothing to play.

        if (!this.main.paused || !playState.paused) {
            this.main.playAll();
            const aset = this.main.player(0);
            if (aset) {
                for (let i = 0; i < aset.size; i++) {
                    aset.fadeIn(i);
                }
            }
        }

        const id = playState.id ?? this._mainState?.id;

        if (!id) {
            return;
        }

        const blob = await retriever.song(id);

        await this.main.addPlayer(await AudioSet.audioSet(this.main.context, [blob]));

        if (!this.main.paused || !playState.paused) {
            this.main.playAll();
            const aset = this.main.player(0);
            if (aset) {
                for (let i = 0; i < aset.size; i++) {
                    aset.fadeIn(i);
                }
            }
        }

        this._mainState = JSON.parse(JSON.stringify(playState));

        // if (file.type === "audioset") {
        //     const baseset = file as WSAudioSet;
        //     baseset.fileIds;
        // }

        // TODO: Sync this via websockets!
    }

    playSfx(): void {
        // TODO: Play sound fx!
    }

    close(): void {
        this.main.close();
        this._ambient.close();
        this._sfx.close();
        AudioGraph._instance = null;
    }

    static graph(): AudioGraph {
        if (!this._instance) {
            this._instance = new AudioGraph();
        }

        return this._instance;
    }
}

export const useAudioGraph = (): AudioGraph | null => {
    const [graph, setGraph] = useState<AudioGraph | null>(null);
    useEffect(() => {
        setGraph(AudioGraph.graph());
        return () => graph?.close();
    }, []);

    return graph;
};
