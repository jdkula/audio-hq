/**
 * AudioControls.tsx
 * ========================
 * Given a PlayState, provides both the audio player
 * and controls for it (play/pause, seek, speed, volume).
 */

import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { IconButton, Popover, Slider, Tooltip, Typography } from '@mui/material';
import useAudio from '../lib/audio/useAudioDetail';
import styled from '@emotion/styled';
import VolumeButton from './VolumeButton';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SpeedIcon from '@mui/icons-material/Speed';
import { Deck_Minimum } from '../lib/urql/graphql_type_helper';
import { sub } from 'date-fns';
import {
    Deck_Type_Enum_Enum,
    UpdateDeckMutationVariables,
    useStopDeckMutation,
    useUpdateDeckMutation,
} from '../lib/generated/graphql';
import { durationOfLength } from '~/lib/utility/util';
import { getDeckInfo, getSpeedChangeData, getUnpauseData } from '~/lib/audio/audio_util';

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
    state: Deck_Minimum;
}

export const AudioControls: FunctionComponent<AudioControlsProps> = ({ state }) => {
    // used to apply speed, volume, and seek while seeking without sending them to the server.
    const [tempVolume, setTempVolume] = useState<number | null>(null);
    const [tempSpeed, setTempSpeed] = useState<number | null>(null);
    const [tempSeek, setTempSeek] = useState<number | null>(null);

    const [volumeAnchorEl, serVolumeAnchor] = useState<HTMLButtonElement | null>(null);
    const [speedAnchorEl, setSpeedAnchor] = useState<HTMLButtonElement | null>(null);

    const { duration, paused, time, volume } = useAudio(state);

    const [, updateDeckInternal] = useUpdateDeckMutation();
    const [, stopPlaying] = useStopDeckMutation();

    const updateDeck = useCallback(
        (update: UpdateDeckMutationVariables['update']) =>
            updateDeckInternal({ deckId: state.id, update: { ...update, dummy: new Date().toISOString() } }),
        [state, updateDeckInternal],
    );

    // propagate blocked and/or loading state up (if the parent wants it)
    useEffect(() => setTempSpeed(state.speed), [state.speed]);

    const finishSeek = (to: number) => {
        const currentTrackInfo = getDeckInfo(state);
        if (!currentTrackInfo) {
            setTempSeek(null);
            return;
        }
        const destinationSeek = (currentTrackInfo.trackInfo.startTime + to) / state.speed;
        updateDeck({
            start_timestamp: sub(new Date(), { seconds: destinationSeek }).toISOString(),
        });
        setTempSeek(null);
    };
    if (!state) {
        return <div>Waiting for Audio to Load</div>;
    }

    const onPlayPause = () => {
        if (state.type === Deck_Type_Enum_Enum.Sfx && paused && !state.pause_timestamp) {
            updateDeck({
                start_timestamp: new Date().toISOString(),
            });
        } else if (state.pause_timestamp) {
            updateDeck(getUnpauseData(state));
        } else {
            updateDeck({ pause_timestamp: new Date().toISOString() });
        }
    };

    const setSpeed = (newSpeed: number) => {
        updateDeck(getSpeedChangeData(state, newSpeed));
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
                    valueLabelFormat={(value) => <Timestamp>{durationOfLength(value)}</Timestamp>}
                    onChangeCommitted={(_, v) => finishSeek(v as number)}
                    onChange={(_, v) => setTempSeek(v as number)}
                />
                <Spaced>
                    <Typography variant="subtitle1">{durationOfLength(tempSeek ?? time)}</Typography>
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
                            updateDeck({ volume: v as number });
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
                        onChangeCommitted={(_, v) => setSpeed(v as number)}
                        onChange={(_, v) => setTempSpeed(v as number)}
                        orientation="vertical"
                        style={{ minHeight: '10rem', margin: '1rem 2.5rem 1rem 1rem' }}
                    />
                </Popover>
                <Tooltip title="Stop playing" placement="bottom" arrow>
                    <IconButton onClick={() => stopPlaying({ deckId: state.id })} size="large">
                        <StopIcon />
                    </IconButton>
                </Tooltip>
            </ControlsContainer>
        </AudioControlsContainer>
    );
};
