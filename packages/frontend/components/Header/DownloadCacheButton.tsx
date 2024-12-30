/**
 * Header/DownloadCacheButton.tsx
 * ===============================
 * Provides a button that queues the download/caching of
 * every track in the workspace, and gives progress
 * updates as they are downloading.
 */

import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import React, { FC, useContext } from 'react';
import { GetApp, OfflinePin } from '@mui/icons-material';

import styled from '@emotion/styled';
import { FileManagerContext } from '~/lib/utility/context';
import { entryIsSingle } from '@audio-hq/clients/lib/AudioHQApi';

const DownloadButtonContainer = styled.div`
    color: white;
    margin: 0 1rem;
    position: relative;
`;

const Progress = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: -4px;
    text-align: center;

    font-size: 10px;
`;

const DownloadCacheButton: FC = () => {
    const fileManager = useContext(FileManagerContext);

    const numFiles = fileManager.files.filter(entryIsSingle).length;
    const numCached = fileManager.cached.size;
    const numUncached = numFiles - numCached;
    const downloading = fileManager.caching.size > 0;

    const onDownload = async () => {
        await fileManager.downloadAll();
    };
    return (
        <DownloadButtonContainer>
            {!downloading && numUncached === 0 && (
                <Tooltip arrow placement="bottom" title="All tracks downloaded">
                    <IconButton color="inherit" onClick={onDownload} size="large" style={{ opacity: 0.5 }}>
                        <OfflinePin />
                    </IconButton>
                </Tooltip>
            )}
            {!downloading && numUncached > 0 && (
                <Tooltip arrow placement="bottom" title="Preload all tracks">
                    <IconButton color="inherit" onClick={onDownload} size="large">
                        <GetApp />
                    </IconButton>
                </Tooltip>
            )}
            {downloading && (
                <IconButton color="inherit" size="large">
                    <CircularProgress
                        color="secondary"
                        variant={numCached === 0 || numFiles === 0 ? 'indeterminate' : 'determinate'}
                        value={numCached === 0 || numFiles === 0 ? undefined : (numCached / numFiles) * 100}
                        size="24px"
                    />
                </IconButton>
            )}
            {numUncached > 0 && (
                <Progress>
                    {numCached} / {numFiles}
                </Progress>
            )}
        </DownloadButtonContainer>
    );
};

export default DownloadCacheButton;
