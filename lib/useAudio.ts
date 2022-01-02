import { PlayState } from './Workspace';
import { useContext, useEffect, useState } from 'react';
import { WorkspaceContext } from './useWorkspace';

interface AudioInfo {
    duration: number;
    volume: number;
    time: number;
    paused: boolean;
    loading: boolean;
    blocked: boolean;
}

const isiOS = () =>
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) ||
    (navigator.userAgent.match(/Safari/) && !navigator.userAgent.match(/Chrome/) && navigator.maxTouchPoints > 0);

const useAudio = (state: PlayState | null): AudioInfo => {
    const ws = useContext(WorkspaceContext);
    const [seek, setSeek] = useState(0);

    const [n, setN] = useState(0);

    useEffect(() => {
        const handle = window.setInterval(() => setN((n) => n + 1), 1000);
        return () => window.clearInterval(handle);
    }, []);

    const f = state ? ws.getCurrentTrackFrom(state)?.file : null;

    useEffect(() => {
        if (!f || !state || !state.startTimestamp) {
            return;
        }
        const timeElapsedMs = ((state.pauseTime ?? Date.now()) - state.startTimestamp) * state.speed;
        const seek = (timeElapsedMs % (f.length * 1000)) / 1000;

        setSeek(seek);
    }, [state, n]);

    return {
        duration: f?.length ?? 2,
        paused: !!state?.pauseTime,
        time: seek,
        volume: state?.volume ?? 0,
        loading: false,
        blocked: false,
    };
};

export default useAudio;
