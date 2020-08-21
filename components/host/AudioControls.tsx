import { PlayState } from '~/lib/Workspace';
import { FunctionComponent, FormEvent, useState, useEffect, useRef, useContext } from 'react';
import { Button } from '@material-ui/core';
import { Seeker } from '../Seeker';
import { WorkspaceContext } from '~/pages/workspace/[id]/host';

function toTimestamp(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const partialSeconds = Math.floor(seconds % 60);

    return `${minutes}:${partialSeconds.toFixed(0).padStart(2, '0')}`;
}

export const AudioControls: FunctionComponent<{
    state?: PlayState;
    onPlay?: () => void;
    onPause?: () => void;
    onSeek?: (to: number) => void;
}> = (props) => {
    const { state, onPlay, onPause, onSeek } = props;

    const ws = useContext(WorkspaceContext);

    const duration = ws?.files.find((f) => f.id === state?.id)?.length ?? 0.01;

    const handle = useRef<number | null>(null);

    const [timestamp, setTimestamp] = useState(0);
    const [seekTimestamp, setSeekTimestamp] = useState<number | null>(null);

    const finishSeek = (to: number) => {
        onSeek?.(to);
        setSeekTimestamp(null);
    };

    useEffect(() => {
        if (!state) return;
        handle.current = window.setInterval(() => {
            setTimestamp((((state.pauseTime ?? Date.now()) - state.startTimestamp) / 1000) % duration);
        }, 500);
        setTimestamp((((state.pauseTime ?? Date.now()) - state.startTimestamp) / 1000) % duration);
        return () => {
            if (!handle.current) return;
            window.clearInterval(handle.current);
        };
    }, [state, duration]);

    if (!state) {
        return <div>Waiting for Audio to Load</div>;
    }

    return (
        <div>
            {state.pauseTime !== null ? (
                <Button variant="outlined" onClick={() => onPlay?.()}>
                    Play
                </Button>
            ) : (
                <Button variant="outlined" onClick={() => onPause?.()}>
                    Pause
                </Button>
            )}

            <Seeker
                value={seekTimestamp ?? timestamp}
                min={0}
                max={duration}
                step={1}
                onSeek={finishSeek}
                onInterimSeek={(v) => setSeekTimestamp(v)}
            />
            {toTimestamp(seekTimestamp ?? timestamp)}
        </div>
    );
};
