/**
 * JobEntry.tsx
 * =============
 * Shows the current progress and status
 * of jobs processing on the server.
 */

import { Box, IconButton, LinearProgress, Paper, Tooltip, Typography } from '@material-ui/core';
import Axios from 'axios';
import { FC } from 'react';
import Job from '~/lib/Job';

import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';

const JobContainer = styled(Paper)`
    border-radius: 1rem;
    margin: 1rem;
    overflow: hidden;
`;

const JobInnerContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    padding: 0 1rem;

    align-items: center;
`;

const JobEntry: FC<{ job: Job; onCanceled?: () => void }> = ({ job, onCanceled }) => {
    const percent = Math.floor((job.progress ?? 0) * 1000) / 10;

    const cancelJob = () => Axios.delete(`/api/jobs/${job.jobId}`).then(() => onCanceled?.());

    const hasValue =
        job.progress !== null &&
        job.status !== 'started' &&
        job.status !== 'done' &&
        job.progress !== 0 &&
        job.progress !== 100;

    return (
        <JobContainer>
            <JobInnerContainer>
                <Box flexGrow={1}>
                    <Typography variant="h6">{job.name}</Typography>
                </Box>
                <Box flexGrow={1} justifySelf="center">
                    <Typography variant="button">{job.status}</Typography>
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center" justifySelf="end">
                    <Box>
                        <Typography variant="button">{percent}%</Typography>
                    </Box>
                    <Tooltip placement="top" title="Hide job" arrow>
                        <IconButton onClick={cancelJob}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </JobInnerContainer>
            {hasValue && <LinearProgress variant="determinate" value={percent} />}
            {!hasValue && job.status !== 'error' && <LinearProgress variant="indeterminate" />}
            {!hasValue && job.status === 'error' && (
                <LinearProgress color="secondary" variant="determinate" value={100} />
            )}
        </JobContainer>
    );
};

export default JobEntry;
