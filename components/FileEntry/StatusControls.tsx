/**
 * FileEntry/StatusControls.tsx
 * ==========================
 * Provides the ability to edit song details,
 * download, or delete a song.
 */

import { Tooltip, IconButton } from '@material-ui/core';
import React, { FC, useContext } from 'react';
import styled from 'styled-components';
import { FileManagerContext } from '~/lib/useFileManager';
import { File } from '~/lib/Workspace';
import CircularProgressWithLabel from '../CircularProgressWithLabel';

import DeleteForever from '@material-ui/icons/DeleteForever';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import EditIcon from '@material-ui/icons/Edit';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import useAlt from '~/lib/useAlt';
import { Favorite } from '@material-ui/icons';
import useFavorites from '~/lib/useFavorites';

const StatusContainerPlacer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const StatusContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    align-items: flex-end;
    justify-items: center;
`;

interface StatusControlsProps {
    file: File;
    editing: boolean;
    setEditing: (editing: boolean) => void;
    setDelete: (deleting: boolean) => void;
}

const StatusControls: FC<StatusControlsProps> = ({ file, editing, setEditing, setDelete }) => {
    const fileManager = useContext(FileManagerContext);
    const favs = useFavorites();
    const altKey = useAlt();

    const cached = fileManager.cached.has(file.id);
    const downloadJob = fileManager.fetching.find((job) => (job.jobId as unknown as string) === file.id);

    const download = async () => {
        fileManager.track(file.id);
    };

    const save = async () => {
        fileManager.track(file.id, (blob) => {
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank', 'norel noreferrer');
        });
    };

    const toggleFavorite = () => {
        if (favs.favorites.has(file.id)) {
            favs.addFavorite(file.id);
        } else {
            favs.removeFavorite(file.id);
        }
    };

    return (
        <StatusContainerPlacer>
            <StatusContainer>
                <Tooltip placement="left" title="Rename" arrow>
                    <IconButton onClick={() => setEditing(!editing)}>
                        <EditIcon color={editing ? 'primary' : undefined} />
                    </IconButton>
                </Tooltip>
                {downloadJob && (
                    <Tooltip placement="left" title="Downloading..." arrow>
                        {downloadJob.progress ? (
                            <CircularProgressWithLabel variant="static" value={downloadJob.progress * 100} />
                        ) : (
                            <CircularProgressWithLabel />
                        )}
                    </Tooltip>
                )}
                {cached && (
                    <Tooltip placement="left" title="Audio cached (click to save to computer)" arrow>
                        <IconButton onClick={save}>
                            <OfflinePinIcon />
                        </IconButton>
                    </Tooltip>
                )}
                {!downloadJob && !cached && (
                    <Tooltip placement="left" title="Audio on the cloud (click to cache)" arrow>
                        <IconButton onClick={download}>
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                )}

                {altKey ? (
                    <Tooltip placement="left" title="Delete" arrow>
                        <IconButton onClick={() => setDelete(true)}>
                            <DeleteForever />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip placement="left" title="Favorite (alt/option to delete)" arrow>
                        <IconButton
                            onClick={toggleFavorite}
                            color={favs.favorites.has(file.id) ? 'primary' : undefined}
                        >
                            <Favorite />
                        </IconButton>
                    </Tooltip>
                )}
            </StatusContainer>
        </StatusContainerPlacer>
    );
};

export default StatusControls;
