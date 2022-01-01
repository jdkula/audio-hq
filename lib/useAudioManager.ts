import { useCallback, useContext, useDebugValue, useEffect, useRef, useState } from 'react';
import { constSelector, useRecoilState } from 'recoil';
import { globalVolumeAtom } from './atoms';
import { FileManager, FileManagerContext } from './useFileManager';
import useWorkspace, { WorkspaceContext, WorkspaceContextType } from './useWorkspace';
import { PlayState, Workspace } from './Workspace';
import _ from 'lodash';

interface AudioManager {
    blocked: boolean;
}

class Track {
    private _fm: FileManager;
    private _state: PlayState;

    private _media: HTMLMediaElement;
    private _node: AudioNode;

    constructor(
        state: PlayState,
        fm: FileManager,
        ctx: AudioContext,
        fileGetter: WorkspaceContextType['getCurrentTrackFrom'],
        onFinish?: () => void,
        onBlocked?: () => void,
        loop = true,
    ) {
        this._fm = fm;
        this._state = state;

        const track = fileGetter(state);
        if (!track) throw new Error("No track found, but we're loading one??");

        const url = fm.track(track.file.id, (blob) => {
            this._media.src = URL.createObjectURL(blob);
        });

        this._media = new Audio(url);
        this._node = ctx.createMediaElementSource(this._media);
        console.log(this._media);
        console.log(this._node);

        this._media.preload = 'auto';

        this._media.onloadstart = () => {
            console.log('audio.current.onloadstart called');
        };

        this._media.onloadedmetadata = () => {
            console.log('audio.current.onloadedmetadata called');
            if (!state.startTimestamp || !this._media.duration) return null;
            const timeElapsedMs = ((state.pauseTime ?? Date.now()) - state.startTimestamp) * state.speed;
            let seek = 0;
            if (timeElapsedMs > this._media.duration * 1000 && !loop) {
                seek = this._media.duration;
            }
            seek = (timeElapsedMs % (this._media.duration * 1000)) / 1000;

            this._media.currentTime = seek;
        };

        this._media.oncanplay = () => {
            console.log('audio.current.oncanplay called');
            if (!state.pauseTime) {
                console.log('Playing', this._media);
                this._media.play().catch(() => {
                    console.log('Blocked');
                    onBlocked?.();
                });
            }
        };

        this._media.onended = () => {
            if (!loop) {
                onFinish?.();
            }
        };

        this._media.loop = loop ?? true;
        this._media.ontimeupdate = () => {
            // 0.44 is an arbitrary buffer time where timeupdate will be able to seek before hitting the end.
            if (this._media.currentTime > this._media.duration - 0.44) {
                if (loop && state.queue.length == 1) {
                    this._media.currentTime = 0;
                } else if (state.queue.length > 1) {
                    const track = fileGetter(state);
                    if (!track) throw new Error("No track found, but we're loading it??");

                    const url = fm.track(track.file.id, (blob) => {
                        this._media.src = URL.createObjectURL(blob);
                    });
                    this._media.src = url;
                }
            }
        };
    }

    connect(node: AudioNode) {
        this._node.connect(node);
    }

    play() {
        this._media.play().catch((e) => console.warn(e));
    }

    pause() {
        this._media.pause();
    }

    isReferentFor(state: PlayState): boolean {
        return (
            state.queue.length === this._state.queue.length &&
            this._state.queue.every((id, idx) => id === state.queue[idx])
        );
    }

    reconcile(newState: PlayState): boolean {
        if (!this.isReferentFor(newState)) return false;

        return _.isEqual(this._state, newState);
    }

    destroy() {
        this._node.disconnect();
        this._media.pause();
        this._media.src = '';
    }
}

export default function useAudioManager(): AudioManager {
    const ws = useContext(WorkspaceContext);
    const fm = useContext(FileManagerContext);

    const [globalVolume, setGlobalVolume] = useRecoilState(globalVolumeAtom);

    const [blocked, setBlocked] = useState(false);
    const [mainTrack, setMainTrack] = useState<Track | null>(null);

    const ac = useRef<AudioContext>(null as never);
    const masterGain = useRef<GainNode>(null as never);

    useEffect(() => {
        const AudioContext = window.AudioContext ?? (window as any)?.webkitAudioContext;
        ac.current = new AudioContext();
        ac.current.onstatechange = () => console.log(ac.current.state);
        masterGain.current = ac.current.createGain();
        masterGain.current.connect(ac.current.destination);
    }, []);

    const unblock = useCallback(() => {
        ac.current.resume();
        setBlocked(false);
        document.removeEventListener('click', unblock);
    }, []);

    useEffect(() => {
        if (blocked) {
            document.addEventListener('click', unblock);
        }
    }, [blocked]);

    useEffect(() => {
        if (!blocked && !ws.state.playing?.pauseTime) {
            mainTrack?.play();
        }
    }, [blocked, mainTrack, ws.state.playing?.pauseTime]);

    // useEffect(() => {
    //     if (ac.current.state === 'suspended') {
    //         // need interaction first
    //         setBlocked(true);
    //     }
    // }, []);

    useEffect(() => {
        if (!ws) return;
        if (ws.state.playing) {
            setMainTrack((track) => {
                if (ws.state.playing && track?.reconcile(ws.state.playing)) {
                    return track;
                }

                track?.destroy();
                const tr = new Track(ws.state.playing!, fm, ac.current, ws.getCurrentTrackFrom, undefined, () =>
                    setBlocked(true),
                );
                tr.connect(masterGain.current);
                return tr;
            });
        } else if (!ws.state.playing) {
            setMainTrack((track) => {
                track?.destroy();
                return null;
            });
        }
    }, [ws?.state]);

    useEffect(() => {
        // TODO: Shadow pausing
        if (globalVolume === 0) {
            ac.current.suspend();
        } else if (globalVolume > 0 && ac.current.state === 'suspended') {
            ac.current.resume();
        }
        masterGain.current.gain.value = globalVolume;
    }, [globalVolume]);

    return {
        blocked,
    };
}
