/**
 * Header/DownloadCacheButton.tsx
 * ===============================
 * Provides a button that queues the download/caching of
 * every track in the workspace, and gives progress
 * updates as they are downloading.
 */

import { Box, IconButton, Tooltip } from '@mui/material';
import React, { FC, useContext } from 'react';
import { GetApp } from '@mui/icons-material';

import CircularProgressWithLabel from '../CircularProgressWithLabel';
import styled from '@emotion/styled';
import { FileManagerContext } from '~/lib/utility/context';

const DownloadButtonContainer = styled.div`
    color: white;
    margin: 0 0.5rem;
`;

const DownloadCacheButton: FC = () => {
    const fileManager = useContext(FileManagerContext);

    const numCached = fileManager.cached.size;
    const numUncached = fileManager.files.length - numCached;
    const downloading = fileManager.caching.size > 0;

    const onDownload = async () => {
        await fileManager.downloadAll();
    };

    return (
        <DownloadButtonContainer>
            {!downloading && (
                <Tooltip arrow placement="bottom" title="Preload all tracks">
                    <IconButton color="inherit" onClick={onDownload} size="large">
                        <GetApp />
                    </IconButton>
                </Tooltip>
            )}
            {downloading && (
                <Box mx="1rem">
                    <Tooltip arrow placement="bottom" title={`${numCached} of ${numUncached} complete.`}>
                        <CircularProgressWithLabel color="secondary" textColor="inherit" variant="indeterminate" />
                    </Tooltip>
                </Box>
            )}
        </DownloadButtonContainer>
    );
};

export default DownloadCacheButton;
