/**
 * Header/GlobalVolumeSlider.tsx
 * ===============================
 * Provides a volume button that displays
 * horizontally and allows the modification
 * of Audio HQ's personal global volume.
 */

import { Typography, Popover, Slider, IconButton, Tooltip, useMediaQuery, useTheme } from '@material-ui/core';
import React, { useState, FC } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import { globalVolumeAtom } from '~/lib/atoms';
import VolumeButton from '../VolumeButton';

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
    const isXSmall = useMediaQuery(theme.breakpoints.down('xs'));

    const [globalVolume, setGlobalVolume] = useRecoilState(globalVolumeAtom);
    const [volumeOpen, setVolumeOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    return (
        <Container>
            {!isXSmall && <Typography variant="body1">Your Volume Controls</Typography>}
            <Tooltip title="Your Volume" placement="bottom" arrow>
                <IconButton color="inherit" ref={(r) => setAnchorEl(r)} onClick={() => setVolumeOpen(true)}>
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
