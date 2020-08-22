import { PlayState, PlayStateResolver } from '~/lib/Workspace';
import { FunctionComponent, FormEvent, useState, useEffect, useRef, useContext } from 'react';
import { Button } from '@material-ui/core';
import { Seeker } from '../Seeker';
import { WorkspaceContext } from '~/pages/workspace/[id]/host';
import useAudio from '~/lib/useAudio';

function toTimestamp(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const partialSeconds = Math.floor(seconds % 60);

    return `${minutes}:${partialSeconds.toFixed(0).padStart(2, '0')}`;
}

export const AudioControls: FunctionComponent<{
    state: PlayState;
    resolver: PlayStateResolver;
}> = ({ state, resolver }) => {
    const { duration, paused, time, volume } = useAudio(state);

    const ws = useContext(WorkspaceContext);

    const [seekTimestamp, setSeekTimestamp] = useState<number | null>(null);

    const finishSeek = (to: number) => {
        resolver({
            startTimestamp: Date.now() - to * 1000,
        });
        setSeekTimestamp(null);
    };

    if (!state) {
        return <div>Waiting for Audio to Load</div>;
    }

    return (
        <div>
            {paused ? (
                <Button variant="outlined" onClick={() => resolver({ pauseTime: null })}>
                    Play
                </Button>
            ) : (
                <Button variant="outlined" onClick={() => resolver({ pauseTime: Date.now() })}>
                    Pause
                </Button>
            )}

            <Seeker value={volume ?? 0} min={0} max={1} step={0.01} onSeek={(v) => resolver({ volume: v })} live />

            <Seeker
                value={seekTimestamp ?? time}
                min={0}
                max={duration}
                step={1}
                onSeek={finishSeek}
                onInterimSeek={(v) => setSeekTimestamp(v)}
            />
            {toTimestamp(seekTimestamp ?? time)}
        </div>
    );
};
