/**
 * JobEntry.tsx
 * =============
 * Shows the current progress and status
 * of jobs processing on the server.
 */

import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    Paper,
    Tooltip,
    Typography,
} from '@mui/material';
import { FC, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import styled from '@emotion/styled';
import { Job_Minimum } from '../lib/urql/graphql_type_helper';
import { Job_Status_Enum_Enum, useDeleteErrorJobMutation } from '~/lib/generated/graphql';

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

const JobEntry: FC<{ job: Job_Minimum; onCanceled?: () => void }> = ({ job }) => {
    const percent = Math.floor((job.progress ?? 0) * 1000) / 10;

    const [showError, setShowError] = useState(false);
    const [, deleteJob] = useDeleteErrorJobMutation();
    // TODO: Cancel

    const hasValue =
        job.progress !== null &&
        (job.status === Job_Status_Enum_Enum.Downloading || job.status === Job_Status_Enum_Enum.Converting) &&
        job.progress !== 0 &&
        job.progress !== 100;

    return (
        <JobContainer>
            <Dialog open={showError} onClose={() => setShowError(false)}>
                <DialogTitle>Error</DialogTitle>
                <DialogContent>
                    <pre>{job.error ?? '[null]'}</pre>
                </DialogContent>
            </Dialog>
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
                    {job.status === Job_Status_Enum_Enum.Error && (
                        <Button onClick={() => setShowError(true)}>ERROR</Button>
                    )}
                    <Tooltip placement="top" title="Hide job" arrow>
                        <IconButton size="large" onClick={() => deleteJob({ jobId: job.id })}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </JobInnerContainer>
            {hasValue && <LinearProgress variant="determinate" value={percent} />}
            {!hasValue && job.status !== Job_Status_Enum_Enum.Error && <LinearProgress variant="indeterminate" />}
            {!hasValue && job.status === Job_Status_Enum_Enum.Error && (
                <LinearProgress color="secondary" variant="determinate" value={100} />
            )}
        </JobContainer>
    );
};

export default JobEntry;
