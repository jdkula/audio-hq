import { PlayState } from './Workspace';
import { useRef, useState, useEffect, useCallback, useContext } from 'react';
import { FileManagerContext } from './useFileManager';

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
    const audio = useRef(new Audio());

    const [volumeValue, setVolume] = useState(0);
    const [timeValue, setTime] = useState(0); // calculate later
    const [duration, setDuration] = useState(0); // calculate later
    const [paused, setPaused] = useState(true);

    const [loading, setLoading] = useState(true);

    const [hasInteracted, setHasInteracted] = useState(true);
    const [blocked, setIsBlocked] = useState(false);

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

        document.addEventListener('keyup', onInteract);
        document.addEventListener('mouseup', onInteract);
        document.addEventListener('touchend', onInteract);
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
                });
        }
    }, [loading]);

    useEffect(() => {
        console.log('AudioTimeUpdate setter called');
        audio.current.ontimeupdate = () => {
            setTime(audio.current.currentTime);
            // 0.44 is an arbitrary buffer time where timeupdate will be able to seek before hitting the end.
            if (loop && audio.current.currentTime > audio.current.duration - 0.44) {
                audio.current.currentTime = 0;
            }
        };
    }, [audio.current, loop]);

    if (!state) return { duration: 0, paused: true, time: 0, volume: 0, loading: true, blocked: blocked };

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
            audio.current.volume = overrideVolume ?? state.volume;
            setVolume(overrideVolume ?? state.volume);
        }
    }, [state.volume, loading, overrideVolume]);

    useEffect(() => {
        console.log('Seeker called');

        if (!loading) {
            let destinationSeek;
            if (state.startTimestamp) {
                destinationSeek = ((state.pauseTime ?? Date.now()) - state.startTimestamp) % (duration * 1000);
            } else {
                destinationSeek = 0;
            }
            audio.current.currentTime = destinationSeek / 1000;
            setTime(destinationSeek / 1000);
        }
    }, [state.startTimestamp, state.pauseTime, loading, hasInteracted]);

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