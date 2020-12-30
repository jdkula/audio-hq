/**
 * Header/DownloadCacheButton.tsx
 * ===============================
 * Provides a button that queues the download/caching of
 * every track in the workspace, and gives progress
 * updates as they are downloading.
 */

import { Box, IconButton, Tooltip } from '@material-ui/core';
import React, { useContext, useState, FC } from 'react';
import { FileManagerContext } from '~/lib/useFileManager';
import { GetApp } from '@material-ui/icons';

import CircularProgressWithLabel from '../CircularProgressWithLabel';
import styled from 'styled-components';

const DownloadButtonContainer = styled.div`
    color: white;
    margin: 0 0.5rem;
`;

const DownloadCacheButton: FC = () => {
    const fileManager = useContext(FileManagerContext);

    const [downloading, setDownloading] = useState(false);
    const [downloadTotal, setDownloadTotal] = useState(0);
    const [downloadFinished, setDownloadFinished] = useState(0);
    const filePartial =
        fileManager.fetching.size === 0
            ? 0
            : fileManager.fetching
                  .map((j) => (j.status === 'saving' ? { ...j, progress: 1 } : j))
                  .filter((j) => j.progress !== null)
                  .reduce((curr, v) => curr + (v.progress as number), 0) / fileManager.fetching.size;
    const downloadPercent =
        downloadTotal === 0
            ? undefined
            : (downloadFinished / downloadTotal) * 100 + (filePartial * 100) / downloadTotal;

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
                    <IconButton color="inherit" onClick={onDownload}>
                        <GetApp />
                    </IconButton>
                </Tooltip>
            )}
            {downloading && (
                <Box mx="1rem">
                    <Tooltip arrow placement="bottom" title={`${downloadFinished} of ${downloadTotal} complete.`}>
                        <CircularProgressWithLabel
                            color="secondary"
                            textColor="inherit"
                            value={downloadPercent}
                            variant={!downloadPercent || downloadPercent === 100 ? 'indeterminate' : 'determinate'}
                        />
                    </Tooltip>
                </Box>
            )}
        </DownloadButtonContainer>
    );
};

export default DownloadCacheButton;
