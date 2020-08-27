import { PlayState, PlayStateResolver } from '~/lib/Workspace';
import { FunctionComponent, useState } from 'react';
import { Box, IconButton, Popover, Slider, Typography } from '@material-ui/core';
import { Seeker } from '../Seeker';
import useAudio from '~/lib/useAudio';
import styled from 'styled-components';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import SpeedIcon from '@material-ui/icons/Speed';
import { VolumeButton } from './Header';

export function toTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const secondsPadded = seconds.toFixed(0).padStart(2, '0');
    const minutesPadded = minutes.toFixed(0).padStart(2, '0');
    if (hours) {
        return `${hours}:${minutesPadded}:${secondsPadded}`;
    } else {
        return `${minutes}:${secondsPadded}`;
    }
}

const AudioControlsContainer = styled.div`
    display: flex;
    align-items: center;
    min-width: 400px;
`;

export const AudioControls: FunctionComponent<{
    state: PlayState;
    resolver: PlayStateResolver;
}> = ({ state, resolver }) => {
    const [tempVolume, setTempVolume] = useState<number | null>(null);
    const [tempSpeed, setTempSpeed] = useState<number | null>(null);
    const [anchorEl, setAnchor] = useState<HTMLButtonElement | null>(null);
    const [speedAnchorEl, setSpeedAnchor] = useState<HTMLButtonElement | null>(null);

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
            <IconButton onClick={onPlayPause}>{paused ? <PlayArrowIcon /> : <PauseIcon />}</IconButton>
            <Slider
                value={seekTimestamp ?? time}
                min={0}
                max={duration}
                step={1}
                onChangeCommitted={(_, v) => finishSeek(v as number)}
                onChange={(_, v) => setSeekTimestamp(v as number)}
            />
            <Box mx={2}>
                <Typography variant="subtitle1">{toTimestamp(seekTimestamp ?? time)}</Typography>
            </Box>
            <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
                <VolumeButton volume={volume} />
            </IconButton>
            <Popover
                id="volume-popover"
                open={!!anchorEl}
                onClose={() => setAnchor(null)}
                anchorEl={anchorEl}
                transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Slider
                    value={volume ?? 0}
                    min={0}
                    max={1}
                    step={0.01}
                    onChangeCommitted={(_, v) => resolver({ volume: v as number })}
                    onChange={(_, v) => setTempVolume(v as number)}
                    orientation="vertical"
                    style={{ minHeight: '5rem', margin: '1rem' }}
                />
            </Popover>
            <IconButton onClick={(e) => setSpeedAnchor(e.currentTarget)}>
                <SpeedIcon />
            </IconButton>
            <Popover
                id="volume-popover"
                open={!!speedAnchorEl}
                onClose={() => setSpeedAnchor(null)}
                anchorEl={speedAnchorEl}
                transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Slider
                    value={tempSpeed ?? 1}
                    min={0.5}
                    max={3}
                    step={0.5}
                    marks={true}
                    valueLabelDisplay="auto"
                    onChangeCommitted={(_, v) => resolver({ speed: v as number, timePlayed: time })}
                    onChange={(_, v) => setTempSpeed(v as number)}
                    orientation="vertical"
                    style={{ minHeight: '5rem', margin: '4rem 1rem 1rem 1rem' }}
                />
            </Popover>
            <IconButton onClick={() => resolver(null)}>
                <StopIcon />
            </IconButton>
        </AudioControlsContainer>
    );
};
