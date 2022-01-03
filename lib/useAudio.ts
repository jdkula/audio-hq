import { PlayState } from './Workspace';
import { useContext, useState } from 'react';
import { WorkspaceContext } from './useWorkspace';
import usePeriodicEffect from './usePeriodicEffect';

interface AudioInfo {
    duration: number;
    volume: number;
    time: number;
    paused: boolean;
    name: string;
}

const useAudio = (state: PlayState | null): AudioInfo => {
    const ws = useContext(WorkspaceContext);
    const [seek, setSeek] = useState(0);

    const f = state ? ws.getCurrentTrackFrom(state) : null;

    usePeriodicEffect(
        500,
        () => {
            const f = state ? ws.getCurrentTrackFrom(state) : null;
            if (!f || !state || !state.startTimestamp) {
                return;
            }
            setSeek(f.duration);
        },
        [state],
    );

    return {
        duration: f?.file.length ?? 2,
        paused: !!state?.pauseTime,
        time: seek,
        volume: state?.volume ?? 0,
        name: f?.file.name ?? 'Loading...',
    };
};

export default useAudio;
