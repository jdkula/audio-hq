import { PlayState } from './Workspace';
import { useContext, useEffect, useState } from 'react';
import { WorkspaceContext } from './useWorkspace';

interface AudioInfo {
    duration: number;
    volume: number;
    time: number;
    paused: boolean;
    name: string;
}

const isiOS = () =>
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) ||
    (navigator.userAgent.match(/Safari/) && !navigator.userAgent.match(/Chrome/) && navigator.maxTouchPoints > 0);

const useAudio = (state: PlayState | null): AudioInfo => {
    const ws = useContext(WorkspaceContext);
    const [seek, setSeek] = useState(0);

    const [n, setN] = useState(0);

    useEffect(() => {
        const handle = window.setInterval(() => setN((n) => n + 1), 500);
        return () => window.clearInterval(handle);
    }, []);

    const f = state ? ws.getCurrentTrackFrom(state) : null;

    useEffect(() => {
        const f = state ? ws.getCurrentTrackFrom(state) : null;
        if (!f || !state || !state.startTimestamp) {
            return;
        }
        setSeek(f.duration);
    }, [state, n]);

    return {
        duration: f?.file.length ?? 2,
        paused: !!state?.pauseTime,
        time: seek,
        volume: state?.volume ?? 0,
        name: f?.file.name ?? 'Loading...',
    };
};

export default useAudio;
