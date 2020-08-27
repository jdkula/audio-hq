import { PlayState } from './Workspace';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FileManagerContext } from './useFileManager';
import { useRecoilState } from 'recoil';
import { globalVolumeAtom } from '~/pages/[id]/host';

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

const useAudio = (state: PlayState | null, { loop, overrideVolume }: Options = {}): AudioInfo => {
    loop = loop ?? true;
    const fileManager = useContext(FileManagerContext);
    const [globalVolume] = useRecoilState(globalVolumeAtom);
    const audio = useRef(new Audio());

    const [volumeValue, setVolume] = useState(0);
    const [timeValue, setTime] = useState(0); // calculate later
    const [duration, setDuration] = useState(0); // calculate later
    const [paused, setPaused] = useState(true);

    const [loading, setLoading] = useState(true);

    const [hasInteracted, setHasInteracted] = useState(true);
    const [blocked, setIsBlocked] = useState(false);

    const handle = useRef<number | null>(null);

    const shadowPaused = globalVolume === 0;

    useEffect(() => {
        console.log('onMount effect ran');
        return () => {
            console.log('onDismount effect ran');
            audio.current.onloadedmetadata = null;
            audio.current.oncanplaythrough = null;
            audio.current.ontimeupdate = null;
            audio.current.pause();
        };
    }, []);

    const onInteract = useCallback(() => {
        console.log('onInteract called');
        audio.current
            .play()
            .then(() => {
                console.log('onInteract -> play() -> then called');
                (state?.pauseTime ?? 0) !== null && audio.current.pause();
                setIsBlocked(false);
                setHasInteracted(true);
            })
            .catch((e) => console.warn(e));
    }, [audio.current]);

    useEffect(() => {
        console.log('Interaction gate called');
        if (!blocked) {
            document.removeEventListener('keyup', onInteract);
            document.removeEventListener('mouseup', onInteract);
            document.removeEventListener('touchend', onInteract);
        }
    }, [blocked]);

    useEffect(() => {
        console.log('Audio setup called');

        audio.current.preload = 'auto';

        audio.current.onloadstart = () => {
            setLoading(true);
        };

        audio.current.onloadedmetadata = () => {
            setDuration(audio.current.duration);
        };

        audio.current.oncanplaythrough = () => {
            setLoading(false);
        };
    }, [audio.current]);

    useEffect(() => {
        console.log('Audio block checker called', loading);
        if (!loading) {
            setIsBlocked(true);
            audio.current
                .play()
                .then(() => {
                    typeof state?.pauseTime === 'number' && audio.current.pause();
                    setIsBlocked(false);
                })
                .catch((err) => {
                    console.warn(err);
                    setHasInteracted(false);
                    setIsBlocked(true);
                    setPaused(true);

                    document.addEventListener('keyup', onInteract);
                    document.addEventListener('mouseup', onInteract);
                    document.addEventListener('touchend', onInteract);
                });
        }
    }, [loading]);

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
        console.log('Song getter called');
        if (audio.current.src?.includes('blob')) {
            URL.revokeObjectURL(audio.current.src);
        }
        audio.current.src = '';
        setLoading(true);
        audio.current.src = fileManager.song(state.id, (cached) => {
            audio.current.src = URL.createObjectURL(cached);
        });
    }, [state.id]);

    useEffect(() => {
        console.log('Volume setter called');

        if (!loading) {
            audio.current.volume = (overrideVolume ?? state.volume) * globalVolume;
            setVolume(overrideVolume ?? state.volume);
        }
    }, [state.volume, loading, overrideVolume, globalVolume]);

    useEffect(() => {
        console.log('Seeker called');

        if (!loading) {
            audio.current.currentTime = getSeek() ?? 0;
            setTime(getSeek() ?? 0);
        }
    }, [getSeek, loading, hasInteracted]);

    useEffect(() => {
        console.log('Play/pauser called');

        if (!loading && !blocked) {
            setPaused(state.pauseTime !== null || !hasInteracted);
            if (state.pauseTime === null) {
                audio.current.play().catch((err) => console.warn(err));
            } else {
                audio.current.pause();
            }
        }
    }, [state.pauseTime, loading, blocked]);

    useEffect(() => {
        if (!loading && !blocked) {
            audio.current.playbackRate = state.speed;
        }
    }, [state.speed, audio.current, loading, blocked]);

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
