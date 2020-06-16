import React from "react";
import AudioSet from "./AudioSet";
import Workspace, { PlayState } from "./Workspace";
import { StateUpdate } from "./WorkspaceAdapter";
import { Player } from "./Player";
import WorkspaceRetriever from "./WorkspaceRetriever";

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

    seek(to?: number): number {}

    volume(vol?: number): number {}

    get duration(): number {}

    async connect(node: AudioNode): Promise<void> {}

    reset(): void {}
}

class AudioEngine<T extends Player> {
    private _context: AudioContext = new AudioContext();
    private _mainGain: GainNode = this._context.createGain();
    private _volume: number = 1;
    private _paused: boolean = true;
    private readonly _players: T[] = [];
    constructor(players: T | T[] = []) {
        this._context.suspend();

        this._mainGain.connect(this._context.destination);

        if (!Array.isArray(players)) {
            players = [players];
        }

        for (const player of players) {
            this.addPlayer(player);
        }
    }

    get paused() {
        return this._paused;
    }

    player(id = 0): T | null {
        return this._players[id] ?? null;
    }

    addPlayer(player: T): T {
        this._players.push(player);
        player.connect(this._mainGain);
        return player;
    }

    playAll(): void {
        this._context.resume();
        for (const player of this._players) {
            player.play();
        }
    }

    pauseAll(): void {
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

export default class AudioGraph {
    private static _instance: AudioGraph | null = null;
    private _main: AudioEngine<AudioSet> = new AudioEngine();
    private _mainState: PlayState | null = null;
    private _ambient: AudioEngine<AudioElementAdapter> = new AudioEngine();
    private _sfx: AudioEngine<AudioElementAdapter> = new AudioEngine();

    private constructor() {}

    playAmbient(): void {
        // TODO: Add ambient music!
    }

    async playMain(playState: PlayState | null, retriever: WorkspaceRetriever, force = false): Promise<void> {
        // TODO: Reconcile, e.g. only pause or play.

        if (!force && playState !== null && playState.id === this._mainState?.id) {
            if (playState.paused) {
                this._main.pauseAll();
            } else {
                this._main.playAll();
                const aset = this._main.player(0);
                if (aset) {
                    for (let i = 0; i < aset.size; i++) {
                        aset.fadeIn(i);
                    }
                }
            }

            // TODO: Timestamp, volume.
            return;
        }

        this._main.reset();

        if (!playState) return; // nothing to play.

        const blob = await retriever.song(playState.id);

        this._main.addPlayer(new AudioSet([blob]));

        if (!this._main.paused || !playState.paused) {
            this._main.playAll();
            const aset = this._main.player(0);
            if (aset) {
                for (let i = 0; i < aset.size; i++) {
                    aset.fadeIn(i);
                }
            }
        }

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
        this._main.close();
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
