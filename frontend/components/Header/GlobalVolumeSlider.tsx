/**
 * Header/GlobalVolumeSlider.tsx
 * ===============================
 * Provides a volume button that displays
 * horizontally and allows the modification
 * of Audio HQ's personal global volume.
 */

import { IconButton, Popover, Slider, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import React, { FC, useState } from 'react';
import styled from '@emotion/styled';

import VolumeButton from '../VolumeButton';
import { useGlobalVolume } from '~/lib/utility/usePersistentData';

const Container = styled.div`
    color: white;
    display: flex;
    align-items: center;
`;

const SliderContainer = styled.div`
    margin: 1.25rem 1rem;
    height: 10rem;
    min-width: 1rem;
`;

const GlobalVolumeSlider: FC = () => {
    const theme = useTheme();

    const [globalVolume, setGlobalVolume] = useGlobalVolume();
    const [volumeOpen, setVolumeOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    return (
        <Container>
            {/* {!isXSmall && <Typography variant="body1">Your Volume Controls</Typography>} */}
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <SliderContainer>
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={globalVolume}
                        onChange={(_, val) => setGlobalVolume(val as number)}
                        orientation="vertical"
                        style={{ height: '100%' }}
                    />
                </SliderContainer>
            </Popover>
        </Container>
    );
};

export default GlobalVolumeSlider;
