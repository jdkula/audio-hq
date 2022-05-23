/**
 * TrackOptions/TrackFadeOptions.tsx
 * ========================
 * Provides an accordion that provides settings
 * relating to fading a track in/out.
 */

import { Accordion, Typography, AccordionDetails, TextField, InputAdornment } from '@mui/material';
import React, { FC } from 'react';
import styled from '@emotion/styled';
import TrackOptionsContainer from './TrackOptionsContainer';
import AccordionCheckboxHeader from './AccordionCheckboxHeader';

const Separator = styled.div`
    margin-bottom: 1rem;
`;

const FadeOptionsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

interface TrackFadeOptionsProps {
    shouldFade: boolean;
    setShouldFade: (shouldFade: boolean) => void;

    fadeTime: number;
    setFadeTime: (fadeTime: number) => void;

    // only affects verbiage.
    fadeType: 'in' | 'out';
}

const TrackFadeOptions: FC<TrackFadeOptionsProps> = ({
    shouldFade,
    setShouldFade,
    fadeTime,
    setFadeTime,
    fadeType,
}) => {
    return (
        <Accordion>
            <AccordionCheckboxHeader
                id={`fade${fadeType}`}
                label={`Fade ${fadeType}`}
                checked={shouldFade}
                setChecked={setShouldFade}
            />
            <AccordionDetails>
                <TrackOptionsContainer>
                    <Typography>
                        Allow the audio track to fade {fadeType} for the specified number of seconds at its beginning.
                    </Typography>
                    <Separator />
                    <FadeOptionsContainer>
                        <TextField
                            type="number"
                            variant="outlined"
                            label="Fade Time"
                            size="small"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                            }}
                            inputProps={{
                                style: { maxWidth: '5rem' },
                            }}
                            value={fadeTime}
                            onChange={(e) => setFadeTime(parseInt(e.currentTarget.value))}
                        />
                    </FadeOptionsContainer>
                </TrackOptionsContainer>
            </AccordionDetails>
        </Accordion>
    );
};
export default TrackFadeOptions;
