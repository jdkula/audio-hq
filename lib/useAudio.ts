import { PlayState } from './Workspace';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FileManagerContext } from './useFileManager';
import { useRecoilState, useRecoilValue } from 'recoil';
import { globalVolumeAtom } from './atoms';

interface AudioInfo {
    duration: number;
    volume: number;
    time: number;
    paused: boolean;
    loading: boolean;
    blocked: boolean;
}

interface Options {
    loop?: boolean;
    overrideVolume?: number;
}

const isiOS = () =>
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) ||
    (navigator.userAgent.match(/Safari/) && navigator.maxTouchPoints > 0);

const useAudio = (state: PlayState | null, { loop, overrideVolume }: Options = {}): AudioInfo => {
    loop = loop ?? true;
    const fileManager = useContext(FileManagerContext);
    const globalVolume = useRecoilValue(globalVolumeAtom);
    const audio = useRef(new Audio());

    const [volumeValue, setVolume] = useState(0);
    const [timeValue, setTime] = useState(0); // calculate later
    const [duration, setDuration] = useState(0); // calculate later
    const [paused, setPaused] = useState(true);

    const [loading, setLoading] = useState(true);

    const [hasInteracted, setHasInteracted] = useState(false);
    const [blocked, setIsBlocked] = useState(false);

    const handle = useRef<number | null>(null);
    const idRef = useRef(''); // used to prevent race conditions with loading many tracks.

    const shadowPaused = globalVolume === 0;

    useEffect(() => {
        console.log('onMount effect ran');
        return () => {
            console.log('onDismount effect ran');
            audio.current.onloadedmetadata = null;
            audio.current.oncanplaythrough = null;
            audio.current.ontimeupdate = null;
            audio.current.onloadstart = null;
            audio.current.pause();
            audio.current.src = '';
            audio.current.load();
            audio.current.remove();
        };
    }, []);

    const onInteract = useCallback(() => {
        console.log('onInteract called');
        audio.current
            .play()
            .then(() => {
                console.log('onInteract -> play() -> then called');
                if (state === null || state.pauseTime !== null) {
                    audio.current.pause();
                }
                setIsBlocked(false);
                setHasInteracted(true);
                clearInteractGate();
                console.log('interaction gate removed');
            })
            .catch((e) => console.warn(e));
    }, [audio.current, state?.pauseTime]);

    const setInteractGate = useCallback(() => {
        document.addEventListener('keyup', onInteract);
        document.addEventListener('mouseup', onInteract);
    }, [onInteract]);

    const clearInteractGate = useCallback(() => {
        document.removeEventListener('keyup', onInteract);
        document.removeEventListener('mouseup', onInteract);
    }, [onInteract]);

    useEffect(() => {
        console.log('Audio setup called');

        audio.current.preload = 'auto';

        audio.current.onloadstart = () => {
            console.log('audio.current.onloadstart called');
            setLoading(true);
        };

        audio.current.onloadedmetadata = () => {
            console.log('audio.current.onloadedmetadata called');
            setDuration(audio.current.duration);
            if (isiOS()) {
                console.log('Hello, I am iOS. Setting interact gate.');
                setIsBlocked(true);
                setInteractGate();
            }
        };

        audio.current.oncanplay = () => {
            console.log('audio.current.oncanplay called');
            setLoading(false);
        };
    }, [audio.current]);

    useEffect(() => {
        console.log('AudioTimeUpdate setter called');
        audio.current.loop = loop ?? true;
        audio.current.ontimeupdate = () => {
            // setTime(audio.current.currentTime);
            // 0.44 is an arbitrary buffer time where timeupdate will be able to seek before hitting the end.
            if (loop && audio.current.currentTime > audio.current.duration - 0.44) {
                audio.current.currentTime = 0;
            }
        };
    }, [audio.current, loop]);

    if (!state) return { duration: 0, paused: true, time: 0, volume: 0, loading: true, blocked: blocked };

    const getSeek = useCallback(() => {
        if (!state.startTimestamp || !duration) return null;
        return ((((state.pauseTime ?? Date.now()) - state.startTimestamp) * state.speed) % (duration * 1000)) / 1000;
    }, [state.startTimestamp, duration, state.speed, state.pauseTime]);

    useEffect(() => {
        handle.current = window.setInterval(() => {
            setTime(getSeek() ?? audio.current.currentTime);
        }, 500);

        return () => {
            if (handle.current) window.clearInterval(handle.current);
            handle.current = null;
        };
    }, [getSeek, audio.current]);

    useEffect(() => {
        console.log('Track getter called', audio, state);
        if (audio.current.src?.includes('blob')) {
            URL.revokeObjectURL(audio.current.src);
        }
        audio.current.src = '';
        idRef.current = state.id;
        setLoading(true);
        audio.current.src = fileManager.track(state.id, (cached) => {
            if (idRef.current === state.id) {
                audio.current.src = URL.createObjectURL(cached);
            }
        });
    }, [audio.current, state.id]);

    useEffect(() => {
        console.log('Volume setter called');

        if (!loading) {
            audio.current.volume = (overrideVolume ?? state.volume) * globalVolume;
            setVolume(overrideVolume ?? state.volume);
        }
    }, [audio.current, state.volume, loading, overrideVolume, globalVolume]);

    useEffect(() => {
        console.log('Seeker called');

        if (!loading) {
            audio.current.currentTime = getSeek() ?? 0;
            setTime(getSeek() ?? 0);
        }
    }, [audio.current, getSeek, loading, hasInteracted]);

    useEffect(() => {
        console.log('Play/pauser called');

        if (!loading && !blocked) {
            setPaused(state.pauseTime !== null);
            if (state.pauseTime === null) {
                audio.current.play().catch((err) => {
                    setIsBlocked(true);
                    setInteractGate();
                    console.warn(err);
                });
            } else {
                audio.current.pause();
            }
        }
    }, [audio.current, state.pauseTime, loading, blocked, setInteractGate]);

    useEffect(() => {
        if (!loading && !blocked) {
            audio.current.playbackRate = state.speed;
        }
    }, [audio.current, state.speed, loading, blocked]);

    // auto-pause when globalVolume is 0 to pretend to the browser that we're paused.
    useEffect(() => {
        if (shadowPaused) {
            audio.current.pause();
        } else {
            if (!loading && !blocked && !paused) {
                if (state.startTimestamp) {
                    audio.current.currentTime = getSeek()!;
                }
                audio.current.play();
            }
        }
    }, [shadowPaused]);

    return {
        duration,
        paused,
        time: timeValue,
        volume: volumeValue,
        loading,
        blocked,
    };
};

export default useAudio;
