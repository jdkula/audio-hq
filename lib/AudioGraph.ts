import React from "react";
import AudioSet from "./AudioSet";
import Workspace from "./Workspace";
import { StateUpdate } from "./WorkspaceAdapter";

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

export default class AudioGraph {
    private static _instanceWs: string | null = null;
    private static _instance: AudioGraph | null = null;
    private _main: Main;
    private _ambient: Ambient;
    private _sfx: SFX;

    constructor(private _setState: (s: StateUpdate) => void) {
        const mainContext = new AudioContext();
        this._main = {
            context: mainContext,
            gain: mainContext.createGain(),
            set: null,
        };

        const ambientContext = new AudioContext();
        this._ambient = {
            context: ambientContext,
            gain: ambientContext.createGain(),
            set: new Set(),
        };

        const ambientSfx = new AudioContext();
        this._sfx = {
            context: ambientSfx,
            gain: ambientSfx.createGain(),
            set: new Set(),
        };
    }

    get main(): { resume: () => void; pause: () => void } {
        // TODO: Refine
        return {
            resume: () => {
                this._setState((state) => {
                    console.log("Setting state", state);
                    const ret = {
                        ...state,
                        playing:
                            state.playing === null
                                ? null
                                : {
                                      ...state.playing,
                                      paused: false,
                                  },
                    };
                    console.log("to", ret);
                    return ret;
                });
                this._main.set?.resume();
            },
            pause: () => {
                this._setState((state) => ({
                    ...state,
                    playing:
                        state.playing === null
                            ? null
                            : {
                                  ...state.playing,
                                  paused: true,
                              },
                }));
                this._main.set?.pause();
            },
        };
    }

    playAmbient(): void {
        // TODO: Add ambient music!
    }

    async playMain(blobs: Iterable<Blob>): Promise<void> {
        const startPaused = this._main.set === null || this._main.set.paused;

        // if (file.type === "audioset") {
        //     const baseset = file as WSAudioSet;
        //     baseset.fileIds;
        // }

        this._main.context.close();
        const newContext = new AudioContext();
        const newGain = newContext.createGain();
        const newSet = await AudioSet.fromBlobs(newContext, blobs, 1.875, false, newGain);

        this._main.context = newContext;
        if (startPaused) {
            await newContext.suspend();
        }
        this._main.gain = newGain;
        this._main.set = newSet;
        this._main.gain.connect(this._main.context.destination);

        newSet.start();
        for (let i = 0; i < this._main.set.pairs.length; i++) {
            newSet.fadeIn(i);
        }

        // TODO: Sync this via websockets!
    }

    playSfx(): void {
        // TODO: Play sound fx!
    }

    close(): void {
        this._main.context.close();
        this._ambient.context.close();
        this._sfx.context.close();
        AudioGraph._instance = null;
        AudioGraph._instanceWs = null;
    }

    static graph(workspace: Workspace, setState: (s: StateUpdate) => void): AudioGraph {
        if (this._instanceWs !== workspace.name) {
            this._instance?.close();
        }
        if (!this._instance) {
            this._instance = new AudioGraph(setState);
            this._instanceWs = workspace.name;
        }

        return this._instance;
    }
}

export const AudioGraphContext = React.createContext<AudioGraph | null>(null);
