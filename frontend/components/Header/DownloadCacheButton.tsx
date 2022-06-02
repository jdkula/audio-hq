/**
 * Header/DownloadCacheButton.tsx
 * ===============================
 * Provides a button that queues the download/caching of
 * every track in the workspace, and gives progress
 * updates as they are downloading.
 */

import { Box, IconButton, Tooltip } from '@mui/material';
import React, { FC, useContext, useState } from 'react';
import { GetApp } from '@mui/icons-material';

import CircularProgressWithLabel from '../CircularProgressWithLabel';
import styled from '@emotion/styled';
import useFileManager from '../../lib/useFileManager';
import { WorkspaceIdContext } from '../../lib/utility';

const DownloadButtonContainer = styled.div`
    color: white;
    margin: 0 0.5rem;
`;

const DownloadCacheButton: FC = () => {
    const workspaceId = useContext(WorkspaceIdContext);
    const fileManager = useFileManager(workspaceId);

    const [downloading, setDownloading] = useState(false);
    const [downloadTotal, setDownloadTotal] = useState(0);
    const [downloadFinished, setDownloadFinished] = useState(0);
    // const filePartial =
    //     fileManager.fetching.length === 0
    //         ? 0
    //         : fileManager.fetching.reduce((curr, v) => curr + (v.progress as number), 0) / fileManager.fetching.length;
    // const downloadPercent =
    //     downloadTotal === 0
    //         ? undefined
    //         : (downloadFinished / downloadTotal) * 100 + (filePartial * 100) / downloadTotal;

    const onDownload = async () => {
        setDownloading(true);
        await fileManager.downloadAll(
            (cached, total) => setDownloadTotal(total - cached),
            (_, finished) => setDownloadFinished(finished),
        );
        setDownloading(false);
        setDownloadTotal(0);
        setDownloadFinished(0);
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
                    <Tooltip arrow placement="bottom" title={`${downloadFinished} of ${downloadTotal} complete.`}>
                        <CircularProgressWithLabel color="secondary" textColor="inherit" variant="indeterminate" />
                    </Tooltip>
                </Box>
            )}
        </DownloadButtonContainer>
    );
};

export default DownloadCacheButton;
