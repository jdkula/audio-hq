import { PlayState, PlayStateResolver } from '~/lib/Workspace';
import { FunctionComponent, useState } from 'react';
import { IconButton, Popover } from '@material-ui/core';
import { Seeker } from '../Seeker';
import useAudio from '~/lib/useAudio';
import styled from 'styled-components';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

function toTimestamp(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const partialSeconds = Math.floor(seconds % 60);

    return `${minutes}:${partialSeconds.toFixed(0).padStart(2, '0')}`;
}

const AudioControlsContainer = styled.div`
    display: flex;
    min-width: 400px;
`;

export const AudioControls: FunctionComponent<{
    state: PlayState;
    resolver: PlayStateResolver;
}> = ({ state, resolver }) => {
    const [tempVolume, setTempVolume] = useState<number | null>(null);
    const [anchorEl, setAnchor] = useState<HTMLButtonElement | null>(null);

    const { duration, paused, time, volume, loading, blocked } = useAudio(state, {
        overrideVolume: tempVolume ?? undefined,
    });

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

    if (loading) return <AudioControlsContainer>Content is loading...</AudioControlsContainer>;
    if (blocked) return <AudioControlsContainer>Please click on the page to allow audio.</AudioControlsContainer>;

    const onPlayPause = () => {
        if (paused) resolver({ pauseTime: null });
        else resolver({ pauseTime: Date.now(), timePlayed: time });
    };

    return (
        <AudioControlsContainer>
            <IconButton onClick={() => resolver(null)}>
                <StopIcon />
            </IconButton>
            <IconButton onClick={onPlayPause}>{paused ? <PlayArrowIcon /> : <PauseIcon />}</IconButton>
            <Seeker
                value={seekTimestamp ?? time}
                min={0}
                max={duration}
                step={1}
                onSeek={finishSeek}
                onInterimSeek={(v) => setSeekTimestamp(v)}
            />
            {toTimestamp(seekTimestamp ?? time)}
            <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
                <VolumeUpIcon />
            </IconButton>
            <Popover
                id="volume-popover"
                open={!!anchorEl}
                onClose={() => setAnchor(null)}
                anchorEl={anchorEl}
                transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Seeker
                    value={volume ?? 0}
                    min={0}
                    max={1}
                    step={0.01}
                    onSeek={(v) => resolver({ volume: v })}
                    onInterimSeek={(v) => setTempVolume(v)}
                    orientation="vertical"
                    style={{ minHeight: '5rem', padding: '0.5rem' }}
                />
            </Popover>
        </AudioControlsContainer>
    );
};
