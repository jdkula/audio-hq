/**
 * FileEntry/StatusControls.tsx
 * ==========================
 * Provides the ability to edit song details,
 * download, or delete a song.
 */

import { IconButton, Tooltip } from '@mui/material';
import React, { FC, useContext } from 'react';
import styled from '@emotion/styled';
import CircularProgressWithLabel from '../CircularProgressWithLabel';

import DeleteForever from '@mui/icons-material/DeleteForever';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import EditIcon from '@mui/icons-material/Edit';
import OfflinePinIcon from '@mui/icons-material/OfflinePin';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import useFileManager from '../../lib/useFileManager';
import { WorkspaceIdContext, useAlt, useFavorites } from '../../lib/utility';
import { File_Minimum } from '../../lib/graphql_type_helper';

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
    file: File_Minimum;
    editing: boolean;
    setEditing: (editing: boolean) => void;
    setDelete: (deleting: boolean) => void;
}

const StatusControls: FC<StatusControlsProps> = ({ file, editing, setEditing, setDelete }) => {
    const workspaceId = useContext(WorkspaceIdContext);
    const fileManager = useFileManager(workspaceId);
    const favs = useFavorites();
    const altKey = useAlt();

    const cached = false; // TODO

    const download = async () => {
        fileManager.track(file); // TODO
    };

    const save = async () => {
        window.open(file.download_url, '_blank', 'norel noreferrer');
    };

    const toggleFavorite = () => {
        if (!favs.favorites.includes(file.id)) {
            favs.addFavorite(file.id);
        } else {
            favs.removeFavorite(file.id);
        }
    };

    return (
        <StatusContainerPlacer>
            <StatusContainer>
                <Tooltip placement="left" title="Rename" arrow>
                    <IconButton onClick={() => setEditing(!editing)} size="large">
                        <EditIcon color={editing ? 'primary' : undefined} />
                    </IconButton>
                </Tooltip>
                {/* {downloadJob && (
                    <Tooltip placement="left" title="Downloading..." arrow>
                        {downloadJob.progress ? (
                            <CircularProgressWithLabel variant="determinate" value={downloadJob.progress * 100} />
                        ) : (
                            <CircularProgressWithLabel />
                        )}
                    </Tooltip>
                )} */}
                {cached && (
                    <Tooltip placement="left" title="Audio cached (click to save to computer)" arrow>
                        <IconButton onClick={save} size="large">
                            <OfflinePinIcon />
                        </IconButton>
                    </Tooltip>
                )}
                {!cached && (
                    <Tooltip placement="left" title="Audio on the cloud (click to cache)" arrow>
                        <IconButton onClick={download} size="large">
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                )}

                {altKey ? (
                    <Tooltip placement="left" title="Delete" arrow>
                        <IconButton onClick={() => setDelete(true)} size="large">
                            <DeleteForever />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip placement="left" title="Favorite (alt/option to delete)" arrow>
                        <IconButton onClick={toggleFavorite} size="large">
                            {favs.favorites.includes(file.id) ? <Favorite /> : <FavoriteBorder />}
                        </IconButton>
                    </Tooltip>
                )}
            </StatusContainer>
        </StatusContainerPlacer>
    );
};

export default StatusControls;
