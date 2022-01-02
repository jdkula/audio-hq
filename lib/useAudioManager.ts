import { useCallback, useContext, useDebugValue, useEffect, useRef, useState } from 'react';
import { constSelector, useRecoilState, useRecoilValue } from 'recoil';
import { globalVolumeAtom, sfxAtom } from './atoms';
import { FileManager, FileManagerContext } from './useFileManager';
import useWorkspace, { WorkspaceContext, WorkspaceContextType } from './useWorkspace';
import { PlayState, Workspace } from './Workspace';
import _ from 'lodash';
import { shouldPlaySFX } from './playUtils';

interface AudioManager {
    blocked: boolean;
}

class Track {
    private _fm: FileManager;
    private _state: PlayState;
    private _getFileInfo: WorkspaceContextType['getCurrentTrackFrom'];

    private _media: HTMLMediaElement;
    private _node: AudioNode;
    private _gain: GainNode;

    private _currentlyPlayingFile = '';

    constructor(
        state: PlayState,
        fm: FileManager,
        ctx: AudioContext,
        fileGetter: WorkspaceContextType['getCurrentTrackFrom'],
        onFinish?: () => void,
        onBlocked?: () => void,
        loop = true,
    ) {
        console.log('<<constructor running>>');
        this._fm = fm;
        this._state = state;
        this._getFileInfo = fileGetter;

        const track = fileGetter(state);
        if (!track) throw new Error("No track found, but we're loading one??");

        this._currentlyPlayingFile = track.file.id;
        const url = fm.track(track.file.id, (blob) => {
            this._media.src = URL.createObjectURL(blob);
        });

        this._media = new Audio(url);
        this._node = ctx.createMediaElementSource(this._media);
        this._gain = ctx.createGain();
        this._node.connect(this._gain);
        console.log(this._media);
        console.log(this._node);

        this._media.preload = 'auto';

        this._media.onloadstart = () => {
            console.log('audio.current.onloadstart called');
        };

        this._media.onloadedmetadata = () => {
            console.log('audio.current.onloadedmetadata called');
            const inf = fileGetter(this._state);
            if (!inf) {
                return;
            }
            this._media.currentTime = inf.duration;
        };

        let initialPlay = false;
        this._media.oncanplay = () => {
            console.log('audio.current.oncanplay called');
            if (!state.pauseTime && !initialPlay) {
                initialPlay = true;
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

                    this._currentlyPlayingFile = track.file.id;
                    const url = fm.track(track.file.id, (blob) => {
                        this._media.src = URL.createObjectURL(blob);
                    });
                    this._media.src = url;
                }
            }
        };

        this._gain.gain.value = state.volume;
        this._media.playbackRate = state.speed;
        this._media.autoplay = true;
    }

    connect(node: AudioNode) {
        this._gain.connect(node);
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

        this._state.volume = newState.volume;
        this._gain.gain.value = newState.volume;

        this._state.speed = newState.speed;
        this._media.playbackRate = newState.speed;

        this._state.startTimestamp = newState.startTimestamp;
        this._state.pauseTime = newState.pauseTime;
        if (this._state.pauseTime && !this._media.paused) {
            this._media.pause();
        } else if (this._media.paused) {
            this._media.play().catch((e) => console.warn(e));
        }
        const inf = this._getFileInfo(this._state);
        if (!inf) {
            return false;
        }

        this._media.currentTime = inf.duration;
        if (this._currentlyPlayingFile !== inf.file.id) {
            this._media.src = this._fm.track(inf.file.id, (blob) => {
                this._media.src = URL.createObjectURL(blob);
            });
        }

        return _.isEqual(this._state, newState);
    }

    rereconcile(): boolean {
        return this.reconcile(this._state);
    }

    destroy() {
        console.log('Destroying...');
        this._node.disconnect();
        this._media.pause();
        this._media.src = '';
    }
}

export default function useAudioManager(): AudioManager {
    const ws = useContext(WorkspaceContext);
    const fm = useContext(FileManagerContext);

    const globalVolume = useRecoilValue(globalVolumeAtom);
    const mainTrack = useRef<Track | null>(null);
    const ambientTracks = useRef<Track[]>([]);
    const sfxTrack = useRef<Track | null>(null);

    const [sfx, setSfx] = useRecoilState(sfxAtom);
    const [blocked, setBlocked] = useState(false);

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
            mainTrack.current?.play();
        }
    }, [blocked, ws.state.playing?.pauseTime]);

    // useEffect(() => {
    //     if (ac.current.state === 'suspended') {
    //         // need interaction first
    //         setBlocked(true);
    //     }
    // }, []);

    useEffect(() => {
        if (!ws) return;
        if (ws.state.playing && ws.state.playing.queue.length > 0) {
            if (ws.state.playing && mainTrack.current?.reconcile(ws.state.playing)) {
                return;
            }

            mainTrack.current?.destroy();
            const tr = new Track(ws.state.playing!, fm, ac.current, ws.getCurrentTrackFrom, undefined, () =>
                setBlocked(true),
            );
            tr.connect(masterGain.current);
            mainTrack.current = tr;
        } else if (!ws.state.playing) {
            mainTrack.current?.destroy();
            mainTrack.current = null;
        }
    }, [ws?.state]);

    useEffect(() => {
        for (let i = ambientTracks.current.length - 1; i >= 0; i--) {
            const track = ambientTracks.current[i];
            const matchedState = ws.state.ambience.find((ps) => track.isReferentFor(ps));
            if (!matchedState) {
                track.destroy();
                ambientTracks.current.splice(i, 1);
            } else if (!track.reconcile(matchedState)) {
                track.destroy();
                const tr = new Track(matchedState, fm, ac.current, ws.getCurrentTrackFrom, undefined, () => {
                    setBlocked(true);
                });
                ambientTracks.current[i] = tr;
                tr.connect(masterGain.current);
            }
        }

        for (const amb of ws.state.ambience) {
            const matchedTrack = ambientTracks.current.find((track) => track.isReferentFor(amb));
            if (!matchedTrack) {
                const tr = new Track(amb, fm, ac.current, ws.getCurrentTrackFrom, undefined, () => {
                    setBlocked(true);
                });
                ambientTracks.current.push(tr);
                tr.connect(masterGain.current);
            }
        }
    }, [ws?.state]);

    useEffect(() => {
        if (
            shouldPlaySFX(ws.state.sfx) ||
            (sfx && (ws.state.sfx.sfx?.queue[0] === sfx?.sfx?.queue[0] || ws.state.sfx.sfx === null))
        ) {
            setSfx(ws.state.sfx);
        }
    }, [ws?.state]);

    useEffect(() => {
        sfxTrack.current?.destroy();
        sfxTrack.current = null;
        if (sfx?.sfx) {
            const tr = new Track(
                sfx?.sfx,
                fm,
                ac.current,
                ws.getCurrentTrackFrom,
                () => {
                    setSfx(null);
                },
                () => {
                    setBlocked(true);
                },
                false,
            );
            sfxTrack.current = tr;
            tr.connect(masterGain.current);
        }
    }, [sfx]);

    useEffect(() => {
        // TODO: Shadow pausing
        masterGain.current.gain.value = globalVolume;
        if (globalVolume === 0 && ac.current.state === 'running') {
            mainTrack.current?.pause();
            for (const track of ambientTracks.current) {
                track.pause();
            }
            sfxTrack.current?.pause();
            ac.current.suspend();
        } else if (ac.current.state === 'suspended') {
            ac.current.resume();
            mainTrack.current?.rereconcile();
            for (const track of ambientTracks.current) {
                track.rereconcile();
            }
            sfxTrack.current?.rereconcile();
        }
    }, [globalVolume, ws.state]);

    return {
        blocked,
    };
}
