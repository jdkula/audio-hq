import { AudioSet } from './AudioSet';
import { PlayState, WorkspaceUpdate, updatePlayState } from './Workspace';
import { WorkspaceRetriever } from './WorkspaceRetriever';
import { useState, useEffect } from 'react';

export class AudioGraph {
    private _master: AudioContext;
    private _masterGain: GainNode;

    private _main: AudioSet = new AudioSet();
    private _mainState: PlayState | null = null;
    private _mainGain: GainNode;

    private _ambient: Set<AudioSet> = new Set();

    private constructor() {
        const AudioContext = window.AudioContext ?? (window as any).webkitAudioContext;

        this._master = new AudioContext();
        this._masterGain = this._master.createGain();
        this._mainGain = this._master.createGain();
        this._mainGain.connect(this._masterGain);
        this._masterGain.connect(this._master.destination);
    }

    async resolve(update: WorkspaceUpdate, retriever: WorkspaceRetriever, force = false): Promise<void> {
        if (update.playing === null && this._mainState !== null) {
            this._main.stop();
            this._mainState = null;
            return;
        }

        this._master.resume();

        if (update.playing) {
            if (update.playing.id !== undefined && (this._mainState?.id !== update.playing.id || force)) {
                const audio = await retriever.song(update.playing.id);
                await this._main.reset(this._mainGain, audio);
            }

            if (update.playing.pauseTime === null) {
                this._main.play();
            } else if (update.playing.pauseTime !== undefined) {
                this._main.pause(); // TODO: Pause at particular time...?
                this._main.seek(
                    (update.playing.pauseTime -
                        (update.playing.startTimestamp ?? this._mainState?.startTimestamp ?? 0)) /
                        1000,
                );
            }
            if (typeof update.playing.startTimestamp === 'number') {
                this._main.seek((Date.now() - update.playing.startTimestamp) / 1000);
            }
            if (typeof update.playing.volume === 'number') {
                this._mainGain.gain.setValueAtTime(update.playing.volume, this._master.currentTime);
                // this._main.volume(update.playing.volume);
            }
        }

        // TODO: Ambience, SFX
    }

    close(): void {
        this._master.close();
        (window as any).__AUDIO_GRAPH_INSTANCE = null;
    }

    static graph(): AudioGraph {
        if (!(window as any).__AUDIO_GRAPH_INSTANCE) {
            (window as any).__AUDIO_GRAPH_INSTANCE = new AudioGraph();
        }

        return (window as any).__AUDIO_GRAPH_INSTANCE;
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
