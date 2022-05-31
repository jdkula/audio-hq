/**
 * Header/GlobalVolumeSlider.tsx
 * ===============================
 * Provides a volume button that displays
 * horizontally and allows the modification
 * of Audio HQ's personal global volume.
 */

import { Typography, Popover, Slider, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import React, { useState, FC } from 'react';
import styled from '@emotion/styled';

import VolumeButton from '../VolumeButton';
import { useLocalReactiveValue } from '../../lib/local_reactive';
import { globalVolumeLRV } from '../../lib/atoms';

const Container = styled.div`
    color: white;
    display: flex;
    align-items: center;
`;

const SliderContainer = styled.div`
    margin: 0.25rem 1rem;
    min-width: 10rem;
`;

const GlobalVolumeSlider: FC = () => {
    const theme = useTheme();
    const isXSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const [globalVolume, setGlobalVolume] = useLocalReactiveValue(globalVolumeLRV);
    const [volumeOpen, setVolumeOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    return (
        <Container>
            {!isXSmall && <Typography variant="body1">Your Volume Controls</Typography>}
            <Tooltip title="Your Volume" placement="bottom" arrow>
                <IconButton
                    color="inherit"
                    ref={(r) => setAnchorEl(r)}
                    onClick={() => setVolumeOpen(true)}
                    size="large"
                >
                    <VolumeButton volume={globalVolume} />
                </IconButton>
            </Tooltip>
            <Popover
                open={volumeOpen}
                onClose={() => setVolumeOpen(false)}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
                transformOrigin={{ vertical: 'center', horizontal: 'right' }}
            >
                <SliderContainer>
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={globalVolume}
                        onChange={(_, val) => setGlobalVolume(val as number)}
                    />
                </SliderContainer>
            </Popover>
        </Container>
    );
};

export default GlobalVolumeSlider;
