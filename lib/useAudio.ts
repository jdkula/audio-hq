import { PlayState } from './Workspace';
import { useRef, useState, useEffect, useCallback } from 'react';
import { WorkspaceRetriever } from './WorkspaceRetriever';

interface AudioInfo {
    duration: number;
    volume: number;
    time: number;
    paused: boolean;
}

const useAudio = (state: PlayState): AudioInfo => {
    const audio = useRef(new Audio());

    const [volumeValue, setVolume] = useState(state.volume);
    const [timeValue, setTime] = useState(0); // calculate later
    const [duration, setDuration] = useState(0); // calculaate later
    const [paused, setPaused] = useState(true);

    const [loading, setLoading] = useState(true);

    const [hasInteracted, setHasInteracted] = useState(true);

    useEffect(() => {
        return () => audio.current.pause();
    }, []);

    useEffect(() => {
        audio.current.preload = 'auto';

        audio.current.addEventListener('loadedmetadata', () => {
            setDuration(audio.current.duration);
        });

        audio.current.addEventListener('canplaythrough', () => {
            setLoading(false);
        });

        audio.current.addEventListener('timeupdate', () => {
            setTime(audio.current.currentTime);
            // 0.44 is an arbitrary buffer time where timeupdate will be able to seek before hitting the end.
            if (audio.current.currentTime > audio.current.duration - 0.44) {
                audio.current.currentTime = 0;
            }
        });
    }, [audio.current]);

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

    const onInteract = useCallback(() => {
        window.requestAnimationFrame(() => {
            setHasInteracted(true);
        });
    }, [setHasInteracted]);

    useEffect(() => {
        if (!loading && hasInteracted) {
            setPaused(state.pauseTime !== null || !hasInteracted);
            if (state.pauseTime === null) {
                audio.current.play().catch(() => {
                    setHasInteracted(false);
                    setPaused(true);
                    document.addEventListener('keyup', onInteract);
                    document.addEventListener('mouseup', onInteract);
                });
            } else {
                audio.current.pause();
            }
        }
    }, [state.pauseTime, loading, hasInteracted]);

    useEffect(() => {
        if (hasInteracted) {
            document.removeEventListener('keyup', onInteract);
            document.removeEventListener('mouseup', onInteract);
        }
    }, [hasInteracted]);

    return {
        duration,
        paused,
        time: timeValue,
        volume: volumeValue,
    };
};

export default useAudio;
