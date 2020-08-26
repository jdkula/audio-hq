import { Button, IconButton } from '@material-ui/core';
import Axios from 'axios';
import { FC } from 'react';
import type { Job } from '~/lib/jobs';

import CloseIcon from '@material-ui/icons/Close';

const JobEntry: FC<{ job: Job; onCanceled?: () => void }> = ({ job, onCanceled }) => {
    const cancelJob = () => Axios.delete(`/api/jobs/${job.jobId}`).then(() => onCanceled?.());
    return (
        <div>
            {job.name} - {job.status} - {Math.floor((job.progress ?? 0) * 1000) / 10}% -{' '}
            <IconButton onClick={cancelJob}>
                <CloseIcon />
            </IconButton>
        </div>
    );
};

export default JobEntry;
