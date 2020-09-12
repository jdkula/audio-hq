import {
    Accordion,
    AccordionSummary,
    Box,
    Checkbox,
    Typography,
    AccordionDetails,
    Hidden,
    InputAdornment,
    TextField,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React, { FC, useEffect, useState } from 'react';
import ConvertOptions from '~/lib/ConvertOptions';

interface TrackCutOptionsProps {
    shouldCut: boolean;
    setShouldCut: (shouldCut: boolean) => void;

    startTime: number;
    setStartTime: (startTime: number) => void;

    endTime: number;
    setEndTime: (endTime: number) => void;
}

const TrackCutOptions: FC<TrackCutOptionsProps> = ({
    shouldCut,
    setShouldCut,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
}) => {
    const timeOptionsInner = (
        <>
            <TextField
                type="number"
                variant="outlined"
                label="Start Time"
                size="small"
                InputProps={{
                    endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                }}
                inputProps={{
                    style: { maxWidth: '5rem' },
                }}
                value={startTime}
                onChange={(e) => setStartTime(parseInt(e.currentTarget.value))}
            />
            <Box m="0.5rem">
                <Typography>to</Typography>
            </Box>
            <TextField
                type="number"
                variant="outlined"
                label="End Time"
                size="small"
                InputProps={{
                    endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                }}
                inputProps={{
                    style: { maxWidth: '5rem' },
                }}
                value={endTime}
                onChange={(e) => setEndTime(parseInt(e.currentTarget.value))}
            />
        </>
    );

    return (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />} id="cut-header" aria-controls="cut-content">
                <Box display="flex" alignItems="center">
                    <Checkbox
                        aria-label="Time Cut Checkbox"
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        onChange={(e) => setShouldCut(e.currentTarget.checked)}
                        checked={shouldCut}
                    />
                    <Typography>Time Cut</Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box display="flex" alignItems="center" flexDirection="column" textAlign="center">
                    <Box mb="1rem">
                        <Typography>
                            Audio HQ, by default, cuts tracks to be at most 1 hour long. You can change or disable that
                            here.
                        </Typography>
                    </Box>
                    <Hidden xsDown>
                        <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                            {timeOptionsInner}
                        </Box>
                    </Hidden>
                    <Hidden smUp>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            width="100%"
                        >
                            {timeOptionsInner}
                        </Box>
                    </Hidden>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default TrackCutOptions;
