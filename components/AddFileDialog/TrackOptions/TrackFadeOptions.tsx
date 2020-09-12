import {
    Accordion,
    AccordionSummary,
    Box,
    Checkbox,
    Typography,
    AccordionDetails,
    TextField,
    InputAdornment,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React, { FC } from 'react';

interface TrackFadeOptionsProps {
    shouldFade: boolean;
    setShouldFade: (shouldFade: boolean) => void;

    fadeTime: number;
    setFadeTime: (fadeTime: number) => void;

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
            <AccordionSummary
                expandIcon={<ExpandMore />}
                id={`fade${fadeType}-header`}
                aria-controls={`fade${fadeType}-content`}
            >
                <Box display="flex" alignItems="center">
                    <Checkbox
                        aria-label={`Fade ${fadeType} Checkbox`}
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        onChange={(e) => setShouldFade(e.currentTarget.checked)}
                        checked={shouldFade}
                    />
                    <Typography>Fade {fadeType}</Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box display="flex" alignItems="center" flexDirection="column" textAlign="center">
                    <Box mb="1rem">
                        <Typography>
                            Allow the audio track to fade {fadeType} for the specified number of seconds at its
                            beginning.
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="center" width="100%">
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
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};
export default TrackFadeOptions;
