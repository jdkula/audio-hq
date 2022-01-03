/**
 * FolderEntry/index.tsx
 * ==============================
 * Provides a user-interactible interface for a given folder.
 * Allows the user to enter the folder, delete the folder
 * (which dumps its contents in the parent folder), or
 * rename a folder.
 */

import React, { FC, forwardRef, KeyboardEvent, MouseEvent, useContext, useState } from 'react';
import FolderIcon from '@mui/icons-material/Folder';
import { Droppable } from 'react-beautiful-dnd';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

import {
    Button,
    IconButton,
    TextField,
    Tooltip,
    Typography,
    Paper,
    ClickAwayListener,
    IconButtonProps,
    ButtonProps,
} from '@mui/material';
import { FileManagerContext } from '~/lib/useFileManager';
import { WorkspaceContext } from '~/lib/useWorkspace';
import { DeleteForever } from '@mui/icons-material';
import styled from '@emotion/styled';
import FolderDeleteDialog from './FolderDeleteDialog';

const FolderContainer = styled(Paper)`
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto;

    margin: 0.5rem 1rem;
    border-radius: 3rem;
    overflow: hidden;
    padding: 0.25rem 0.25rem;
    transition: background-color 0.25s;
    align-content: center;
    align-items: center;
    min-height: 50px;

    &:hover {
        background-color: #eee;
    }
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
    up?: boolean;
}

const FolderButton: FC<FolderButtonProps> = ({ dragging, up, ...props }) => {
    let icon;
    if (dragging) {
        icon = <FolderOpenIcon color="primary" />;
    } else if (up) {
        icon = <ArrowBackIcon />;
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

const FolderEntry: FC<{ name: string; path: string[]; onClick: () => void; up?: boolean }> = ({
    name,
    path,
    onClick,
    up,
}) => {
    const workspace = useContext(WorkspaceContext);
    const fileManager = useContext(FileManagerContext);

    const [renaming, setRenaming] = useState(false);
    const [newName, setNewName] = useState('');

    const [deleting, setDeleting] = useState(false);

    const fullPath = [...path, name];

    const startRenaming = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (up) return;
        setRenaming(!renaming);
        setNewName(name);
    };

    const stopRenaming = () => {
        setRenaming(!renaming);
        setNewName(name);
    };

    const subfiles = () =>
        workspace.files.filter(
            (file) =>
                file.path.length >= fullPath.length && fullPath.every((pathElement, i) => pathElement === file.path[i]),
        );

    const onRename = () => {
        console.log('subfiles', subfiles(), 'path', path, 'fullPath', fullPath);
        subfiles().forEach((file) =>
            fileManager.update(file.id, { path: [...path, newName, ...file.path.slice(fullPath.length)] }),
        );
        setRenaming(false);
    };

    const onDelete = () => {
        subfiles().forEach((file) =>
            fileManager.update(file.id, { path: [...path, ...file.path.slice(fullPath.length)] }),
        );
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
            {name || 'Untitled Folder...'}
        </Typography>
    );

    const editor = (
        <ClickAwayListener onClickAway={stopRenaming}>
            <EditorContainer onClick={(e) => e.stopPropagation()}>
                <Tooltip title="Pro tip: Enter the name of another folder to merge them!" placement="top" arrow>
                    <TextField
                        id={encodeURIComponent(JSON.stringify(fullPath)) + '-name'}
                        fullWidth
                        autoFocus
                        label="Name"
                        variant="outlined"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </Tooltip>

                <SaveButton onClick={onRename}>Save</SaveButton>
            </EditorContainer>
        </ClickAwayListener>
    );

    const main = up || !renaming ? nameComponent : editor;

    const controls = (
        <ControlsContainer>
            <Tooltip placement="left" title="Rename" arrow>
                <IconButton onClick={startRenaming} size="large">
                    <EditIcon color={renaming ? 'primary' : undefined} />
                </IconButton>
            </Tooltip>
            <Tooltip placement="left" title="Delete Folder" arrow>
                <IconButton onClick={onDeleteInitiate} size="large">
                    <DeleteForever />
                </IconButton>
            </Tooltip>
        </ControlsContainer>
    );
    return (
        <Droppable droppableId={up ? '___back___' : `___folder_${name}`}>
            {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    <FolderDeleteDialog
                        folder={name}
                        onConfirm={onDelete}
                        open={deleting}
                        onClose={() => setDeleting(false)}
                    />
                    <FolderContainer onClick={onClick} style={{ cursor: 'pointer' }}>
                        <MainContainer>
                            <FolderButton dragging={snapshot.isDraggingOver} up={up} />
                            {main}
                        </MainContainer>
                        <div style={{ display: 'none' }}>{provided.placeholder}</div>
                        {!up && controls}
                    </FolderContainer>
                </div>
            )}
        </Droppable>
    );
};

export default FolderEntry;
