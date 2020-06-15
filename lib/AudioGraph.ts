import React from "react";
import AudioSet from "./AudioSet";
import Workspace, { Audio as WSAudio, File, AudioSet as WSAudioSet, WorkspaceState } from "./Workspace";

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

    constructor(private readonly workspace: Workspace, private _setWorkspace: (workspace: Workspace) => any) {
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

    get main(): AudioSet | null {
        return this._main.set;
    }

    playAmbient(audio: WSAudio) {
        
    }

    async playMain(file: File) {
        const files = [];

        const startPaused = this.main === null || this.main.paused;

        if (file.type === "audioset") {
            const baseset = file as WSAudioSet;
            baseset.fileIds;
        }

        this._main.context.close();
        const newContext = new AudioContext();
        const newGain = newContext.createGain();
        const newSet = await AudioSet.fromFileList(newContext, files, 1.875, false, newGain);

        this._main.context = newContext;
        if (startPaused) {
            await newContext.suspend();
        }
        this._main.gain = newGain;
        this._main.set = newSet;
        this._main.gain.connect(this._main.context.destination);

        newSet.start();
        newSet.fadeIn(0);
    }

    playSfx(audio: WSAudio) {
            
    }

    close() {
        this._main.context.close();
        this._ambient.context.close();
        this._sfx.context.close();
        AudioGraph._instance = null;
        AudioGraph._instanceWs = null;
    }

    static graph(workspace: Workspace, setWorkspace: (workspace: Workspace) => any): AudioGraph {
        if (this._instanceWs !== workspace.name) {
            this._instance?.close();
        }
        if (!this._instance) {
            this._instance = new AudioGraph(workspace, setWorkspace);
            this._instanceWs = workspace.name;
        }

        return this._instance;
    }
}

export const AudioGraphContext = React.createContext(new AudioGraph());
