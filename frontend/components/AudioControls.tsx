/**
 * AudioControls.tsx
 * ========================
 * Given a PlayState, provides both the audio player
 * and controls for it (play/pause, seek, speed, volume).
 */

import { FunctionComponent, useCallback, useContext, useEffect, useState } from 'react';
import { IconButton, Popover, Slider, Tooltip, Typography } from '@mui/material';
import useAudio from '../lib/audio/useAudio';
import styled from '@emotion/styled';
import VolumeButton from './VolumeButton';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SpeedIcon from '@mui/icons-material/Speed';
import { getTrackInfo, toTimestamp } from '../lib/utility';
import { Play_Status_Minimum } from '../lib/graphql_type_helper';
import { UpdateTrackMutationVariables, useStopTrackMutation, useUpdateTrackMutation } from '../lib/generated/graphql';
import { sub } from 'date-fns';

const speedMarks = [
    { value: 0.25, label: '1/4x' },
    { value: 0.5, label: '1/2x' },
    { value: 1, label: '1x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
    { value: 2.5, label: '2.5x' },
    { value: 3, label: '3x' },
];

const AudioControlsContainer = styled.div`
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 1fr min-content;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
    width: 100%;
    min-width: 500px;
    @media only screen and (max-width: 550px) {
        min-width: 300px;
        grid-template-rows: auto auto;
        grid-template-columns: 100%;
    }
`;

const ControlsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

const Spaced = styled.div`
    margin: 0 0.5rem;
`;

const Timestamp = styled.div`
    font-size: 7pt;
`;

interface AudioControlsProps {
    state: Play_Status_Minimum;
}

export const AudioControls: FunctionComponent<AudioControlsProps> = ({ state }) => {
    // used to apply speed, volume, and seek while seeking without sending them to the server.
    const [tempVolume, setTempVolume] = useState<number | null>(null);
    const [tempSpeed, setTempSpeed] = useState<number | null>(null);
    const [tempSeek, setTempSeek] = useState<number | null>(null);

    const [volumeAnchorEl, serVolumeAnchor] = useState<HTMLButtonElement | null>(null);
    const [speedAnchorEl, setSpeedAnchor] = useState<HTMLButtonElement | null>(null);

    const { duration, paused, time, volume } = useAudio(state);

    const [, updateStatusInternal] = useUpdateTrackMutation();
    const [, stopPlaying] = useStopTrackMutation();

    const updateStatus = useCallback(
        (update: UpdateTrackMutationVariables['update']) => updateStatusInternal({ trackId: state.id, update }),
        [state, updateStatusInternal],
    );

    // propagate blocked and/or loading state up (if the parent wants it)
    useEffect(() => setTempSpeed(state.speed), [state.speed]);

    const finishSeek = (to: number) => {
        const currentTrackInfo = getTrackInfo(state);
        const prev = currentTrackInfo?.totalTimeBefore ?? 0;
        const destinationSeek = (prev + to) / state.speed;
        console.log('Seeking... with CTI', currentTrackInfo);
        updateStatus({
            start_timestamp: sub(new Date(), { seconds: destinationSeek }),
        });
        setTempSeek(null);
    };
    if (!state) {
        return <div>Waiting for Audio to Load</div>;
    }

    // if (blocked) return <AudioControlsContainer>Please click on the page to allow audio.</AudioControlsContainer>;
    // if (loading) return <AudioControlsContainer>Content is loading...</AudioControlsContainer>;

    const onPlayPause = () => {
        if (paused) updateStatus({ pause_timestamp: null });
        else updateStatus({ pause_timestamp: new Date() });
    };

    return (
        <AudioControlsContainer>
            <ControlsContainer>
                <Tooltip title={paused ? 'Play' : 'Pause'} placement="bottom" arrow>
                    <IconButton onClick={onPlayPause} size="large">
                        {paused ? <PlayArrowIcon /> : <PauseIcon />}
                    </IconButton>
                </Tooltip>
                <Slider
                    value={tempSeek ?? time}
                    min={0}
                    max={duration}
                    step={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => <Timestamp>{toTimestamp(value)}</Timestamp>}
                    onChangeCommitted={(_, v) => finishSeek(v as number)}
                    onChange={(_, v) => setTempSeek(v as number)}
                />
                <Spaced>
                    <Typography variant="subtitle1">{toTimestamp(tempSeek ?? time)}</Typography>
                </Spaced>
            </ControlsContainer>
            <ControlsContainer>
                <Tooltip title="Volume (for everyone!)" placement="bottom" arrow>
                    <IconButton onClick={(e) => serVolumeAnchor(e.currentTarget)} size="large">
                        <VolumeButton volume={volume} />
                    </IconButton>
                </Tooltip>
                <Popover
                    open={!!volumeAnchorEl}
                    onClose={() => serVolumeAnchor(null)}
                    anchorEl={volumeAnchorEl}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Slider
                        value={tempVolume ?? volume ?? 0}
                        min={0}
                        max={1}
                        step={0.01}
                        onChangeCommitted={(_, v) => {
                            updateStatus({ volume: v as number });
                            setTempVolume(null);
                        }}
                        onChange={(_, v) => setTempVolume(v as number)}
                        orientation="vertical"
                        style={{ minHeight: '10rem', margin: '1rem' }}
                    />
                </Popover>
                <Tooltip title="Speed (for everyone!)" placement="bottom" arrow>
                    <IconButton onClick={(e) => setSpeedAnchor(e.currentTarget)} size="large">
                        <SpeedIcon />
                    </IconButton>
                </Tooltip>
                <Popover
                    open={!!speedAnchorEl}
                    onClose={() => setSpeedAnchor(null)}
                    anchorEl={speedAnchorEl}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Slider
                        value={tempSpeed ?? 1}
                        min={0}
                        max={3}
                        step={null}
                        marks={speedMarks}
                        onChangeCommitted={(_, v) =>
                            updateStatus({
                                speed: v as number,
                                start_timestamp: sub(new Date(), { seconds: 0 /* TODO */ }),
                            })
                        }
                        onChange={(_, v) => setTempSpeed(v as number)}
                        orientation="vertical"
                        style={{ minHeight: '10rem', margin: '1rem 2.5rem 1rem 1rem' }}
                    />
                </Popover>
                <Tooltip title="Stop playing" placement="bottom" arrow>
                    <IconButton onClick={() => stopPlaying({ trackId: state.id })} size="large">
                        <StopIcon />
                    </IconButton>
                </Tooltip>
            </ControlsContainer>
        </AudioControlsContainer>
    );
};
