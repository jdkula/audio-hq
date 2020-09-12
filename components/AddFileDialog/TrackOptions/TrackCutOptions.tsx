import { Accordion, Typography, AccordionDetails, InputAdornment, TextField } from '@material-ui/core';
import React, { FC } from 'react';
import styled from 'styled-components';
import AccordionCheckboxHeader from './AccordionCheckboxHeader';
import TrackOptionsContainer from './TrackOptionsContainer';

const Separator = styled.div`
    margin-bottom: 1rem;
`;

const ToContainer = styled(Typography)`
    margin: 0.5rem;
`;

const TimeOptionsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    ${({ theme }) => theme.breakpoints.down('xs')} {
        flex-direction: column;
    }
`;

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
    return (
        <Accordion defaultExpanded>
            <AccordionCheckboxHeader id="cut-options" label="Time Cut" checked={shouldCut} setChecked={setShouldCut} />
            <AccordionDetails>
                <TrackOptionsContainer>
                    <Typography>
                        Audio HQ, by default, cuts tracks to be at most 1 hour long. You can change or disable that
                        here.
                    </Typography>
                    <Separator />
                    <TimeOptionsContainer>
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
                        <ToContainer>to</ToContainer>
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
                    </TimeOptionsContainer>
                </TrackOptionsContainer>
            </AccordionDetails>
        </Accordion>
    );
};

export default TrackCutOptions;
