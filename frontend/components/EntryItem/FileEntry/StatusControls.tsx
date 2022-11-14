/**
 * FileEntry/StatusControls.tsx
 * ==========================
 * Provides the ability to edit song details,
 * download, or delete a song.
 */

import { IconButton, Tooltip } from '@mui/material';
import React, { FC } from 'react';
import styled from '@emotion/styled';

import DeleteForever from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useAlt } from '~/lib/utility/hooks';
import { useFavorites } from '~/lib/utility/usePersistentData';
import * as API from '~/lib/api/models';

const StatusContainerPlacer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const StatusContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    align-items: flex-end;
    justify-items: center;
`;

interface StatusControlsProps {
    file: API.Single;
    editing: boolean;
    setEditing: (editing: boolean) => void;
    setDelete: (deleting: boolean) => void;
}

const StatusControls: FC<StatusControlsProps> = ({ file, editing, setEditing, setDelete }) => {
    const favs = useFavorites();
    const altKey = useAlt();

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
                <Tooltip placement="top-end" title="Rename" arrow>
                    <IconButton onClick={() => setEditing(!editing)} size="large">
                        <EditIcon color={editing ? 'primary' : undefined} />
                    </IconButton>
                </Tooltip>

                {altKey ? (
                    <Tooltip placement="top-end" title="Delete" arrow>
                        <IconButton onClick={() => setDelete(true)} size="large">
                            <DeleteForever />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip placement="top-end" title="Favorite (alt/option to delete)" arrow>
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
