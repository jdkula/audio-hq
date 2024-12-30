/**
 * FolderEntry/index.tsx
 * ==============================
 * Provides a user-interactible interface for a given folder.
 * Allows the user to enter the folder, delete the folder
 * (which dumps its contents in the parent folder), or
 * rename a folder.
 */

import React, { FC, KeyboardEvent, MouseEvent, useContext, useState } from 'react';
import FolderIcon from '@mui/icons-material/Folder';

import EditIcon from '@mui/icons-material/Edit';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

import {
    Button,
    ButtonProps,
    ClickAwayListener,
    IconButton,
    IconButtonProps,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import styled from '@emotion/styled';
import FolderDeleteDialog from './FolderDeleteDialog';
import { WorkspaceIdContext } from '~/lib/utility/context';
import { useDeleteEntryMutation, useUpdateEntryMutation, useWorkspaceEntries } from '~/lib/api/hooks';
import { Folder } from '@audio-hq/common/lib/api/models';
import { useIsOnline } from '~/lib/utility/hooks';
import { entryIsFolder } from '@audio-hq/clients/lib/AudioHQApi';
import _ from 'lodash';

const FolderContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto;

    width: 100%;

    align-content: center;
    align-items: center;
`;

const ControlsContainer = styled.div`
    justify-self: end;

    display: flex;
    flex-wrap: nowrap;
`;

const EditorContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0.5rem;
`;

const SaveButtonBase = styled(Button)`
    margin: 0 0.75rem;
`;

const SaveButton: FC<ButtonProps> = (props) => <SaveButtonBase {...props} variant="outlined" color="primary" />;

const MainContainer = styled.div`
    display: flex;
    align-items: center;
`;

interface FolderButtonProps extends IconButtonProps {
    dragging?: boolean;
}

const FolderButton: FC<FolderButtonProps> = ({ dragging, ...props }) => {
    let icon;
    if (dragging) {
        icon = <FolderOpenIcon color="primary" />;
    } else {
        icon = <FolderIcon />;
    }

    return (
        <Tooltip title="Click to enter folder" placement="left" arrow>
            <IconButton {...props} size="large">
                {icon}
            </IconButton>
        </Tooltip>
    );
};

const FolderEntry: FC<{ folder: Folder; path: string[]; onClick: () => void; dragging?: boolean }> = ({
    folder,
    path,
    onClick,
    dragging,
}) => {
    const online = useIsOnline();
    const workspaceId = useContext(WorkspaceIdContext);

    const updateEntry = useUpdateEntryMutation(workspaceId);
    const deleteEntry = useDeleteEntryMutation(workspaceId);

    const [renaming, setRenaming] = useState(false);
    const [newName, setNewName] = useState('');

    const [deleting, setDeleting] = useState(false);

    const fullPath = [...path, folder.name];

    const overlappingFolders = useWorkspaceEntries(workspaceId)
        .data?.filter(entryIsFolder)
        .filter((entry) => _.isEqual(entry.path, path))
        .filter((entry) => entry.id !== folder.id)
        .map((entry) => entry.name);

    const nameCollision = overlappingFolders?.includes(newName);

    const startRenaming = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setRenaming(!renaming);
        setNewName(folder.name);
    };

    const stopRenaming = () => {
        setRenaming(!renaming);
        setNewName(folder.name);
    };

    const onRename = () => {
        if (nameCollision || newName.length === 0) return;

        updateEntry.mutateAsync({
            entry: folder,
            update: {
                ...folder,
                name: newName,
            },
        });
        setRenaming(false);
    };

    const onDelete = () => {
        deleteEntry.mutateAsync({
            entry: folder,
        });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.code === 'Enter') {
            e.preventDefault();
            onRename();
        }
        if (e.nativeEvent.code === 'Escape') {
            e.preventDefault();
            stopRenaming();
        }
    };

    const onDeleteInitiate = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setDeleting(true);
    };

    const nameComponent = (
        <Typography variant="body1" component="span">
            {folder.name || 'Untitled Folder...'}
        </Typography>
    );

    const editor = (
        <ClickAwayListener onClickAway={stopRenaming}>
            <EditorContainer onClick={(e) => e.stopPropagation()}>
                <TextField
                    id={encodeURIComponent(JSON.stringify(fullPath)) + '-name'}
                    fullWidth
                    autoFocus
                    label="Name"
                    variant="outlined"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    error={nameCollision}
                    helperText={nameCollision ? 'That name is already taken.' : ''}
                />

                <SaveButton onClick={onRename} disabled={nameCollision || newName.length === 0}>
                    Save
                </SaveButton>
            </EditorContainer>
        </ClickAwayListener>
    );

    const main = !renaming ? nameComponent : editor;

    const controls = (
        <ControlsContainer>
            <Tooltip placement="left" title="Rename" arrow>
                <IconButton onClick={startRenaming} size="large" disabled={online === false}>
                    <EditIcon color={renaming ? 'primary' : undefined} />
                </IconButton>
            </Tooltip>
            <Tooltip placement="left" title="Delete Folder" arrow>
                <IconButton onClick={onDeleteInitiate} size="large" disabled={online === false}>
                    <DeleteForever />
                </IconButton>
            </Tooltip>
        </ControlsContainer>
    );
    return (
        <>
            <FolderDeleteDialog
                folder={folder.name}
                onConfirm={onDelete}
                open={deleting}
                onClose={() => setDeleting(false)}
            />
            <FolderContainer onClick={onClick} style={{ cursor: 'pointer' }}>
                <MainContainer>
                    <FolderButton dragging={dragging} />
                    {main}
                </MainContainer>
                {controls}
            </FolderContainer>
        </>
    );
};

export default FolderEntry;
