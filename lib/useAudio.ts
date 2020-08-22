import { PlayState } from './Workspace';
import { useRef, useState, useEffect, useCallback } from 'react';
import { WorkspaceRetriever } from './WorkspaceRetriever';

interface AudioInfo {
    duration: number;
    volume: number;
    time: number;
    paused: boolean;
    loading: boolean;
    blocked: boolean;
}

const useAudio = (state: PlayState | null, loop = true): AudioInfo => {
    const audio = useRef(new Audio());

    const [volumeValue, setVolume] = useState(0);
    const [timeValue, setTime] = useState(0); // calculate later
    const [duration, setDuration] = useState(0); // calculaate later
    const [paused, setPaused] = useState(true);

    const [loading, setLoading] = useState(true);

    const [hasInteracted, setHasInteracted] = useState(true);
    const [blocked, setIsBlocked] = useState(false);

    useEffect(() => {
        return () => {
            audio.current.onloadedmetadata = null;
            audio.current.oncanplaythrough = null;
            audio.current.ontimeupdate = null;
            audio.current.pause();
        };
    }, []);

    const onInteract = useCallback(() => {
        audio.current.play().then(() => audio.current.pause());
        window.requestAnimationFrame(() => {
            setIsBlocked(false);
            setHasInteracted(true);
        });
    }, [audio.current, setHasInteracted]);

    useEffect(() => {
        if (hasInteracted) {
            document.removeEventListener('keyup', onInteract);
            document.removeEventListener('mouseup', onInteract);
            document.removeEventListener('touchend', onInteract);
        }
    }, [hasInteracted]);

    useEffect(() => {
        audio.current.preload = 'auto';

        audio.current.onloadedmetadata = () => {
            setDuration(audio.current.duration);
        };

        audio.current.oncanplaythrough = () => {
            setLoading(false);
        };

        document.addEventListener('keyup', onInteract);
        document.addEventListener('mouseup', onInteract);
        document.addEventListener('touchend', onInteract);

        audio.current
            .play()
            .then(() => (state?.pauseTime ?? 0) !== null && audio.current.pause())
            .catch((err) => {
                console.warn(err);
                setHasInteracted(false);
                setIsBlocked(true);
                setPaused(true);
            });
    }, [audio.current]);

    useEffect(() => {
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
        setLoading(true);
        WorkspaceRetriever.song(state.id).then(([blob]) => {
            audio.current.src = URL.createObjectURL(blob);
        });
    }, [state.id]);

    useEffect(() => {
        if (!loading) {
            audio.current.volume = state.volume;
            setVolume(state.volume);
        }
    }, [state.volume, loading]);

    useEffect(() => {
        if (!loading) {
            const destinationSeek = ((state.pauseTime ?? Date.now()) - state.startTimestamp) % (duration * 1000);
            audio.current.currentTime = destinationSeek / 1000;
            setTime(destinationSeek / 1000);
        }
    }, [state.startTimestamp, state.pauseTime, loading, hasInteracted]);

    useEffect(() => {
        if (!loading && hasInteracted) {
            setPaused(state.pauseTime !== null || !hasInteracted);
            if (state.pauseTime === null) {
                audio.current.play().catch((err) => console.warn(err));
            } else {
                audio.current.pause();
            }
        }
    }, [state.pauseTime, loading, hasInteracted]);

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
