/**
 * JobEntry.tsx
 * =============
 * Shows the current progress and status
 * of jobs processing on the server.
 */

import { Box, IconButton, LinearProgress, Paper, Tooltip, Typography } from '@mui/material';
import Axios from 'axios';
import { FC } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';
import { Job } from '../lib/generated/graphql';
import { Job_Minimum } from '../lib/graphql_type_helper';

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

const JobEntry: FC<{ job: Job_Minimum; onCanceled?: () => void }> = ({ job, onCanceled }) => {
    const percent = Math.floor((job.progress ?? 0) * 1000) / 10;

    // TODO: Cancel

    const hasValue =
        job.progress !== null &&
        job.progress_stage !== 'started' &&
        job.progress_stage !== 'done' &&
        job.progress !== 0 &&
        job.progress !== 100;

    return (
        <JobContainer>
            <JobInnerContainer>
                <Box flexGrow={1}>
                    <Typography variant="h6">{job.name}</Typography>
                </Box>
                <Box flexGrow={1} justifySelf="center">
                    <Typography variant="button">{job.progress_stage}</Typography>
                </Box>
                <Box flexGrow={1} display="flex" alignItems="center" justifySelf="end">
                    <Box>
                        <Typography variant="button">{percent}%</Typography>
                    </Box>
                    <Tooltip placement="top" title="Hide job" arrow>
                        <IconButton size="large">
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </JobInnerContainer>
            {hasValue && <LinearProgress variant="determinate" value={percent} />}
            {!hasValue && job.progress_stage !== 'error' && <LinearProgress variant="indeterminate" />}
            {!hasValue && job.progress_stage === 'error' && (
                <LinearProgress color="secondary" variant="determinate" value={100} />
            )}
        </JobContainer>
    );
};

export default JobEntry;
