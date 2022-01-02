/**
 * FolderEntry/index.tsx
 * ==============================
 * Provides a user-interactible interface for a given folder.
 * Allows the user to enter the folder, delete the folder
 * (which dumps its contents in the parent folder), or
 * rename a folder.
 */

import React, { FC, KeyboardEvent, MouseEvent, MouseEventHandler, useContext, useState } from 'react';
import FolderIcon from '@material-ui/icons/Folder';
import { Droppable } from 'react-beautiful-dnd';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

import {
    Button,
    IconButton,
    TextField,
    Tooltip,
    Typography,
    Paper,
    ClickAwayListener,
    IconButtonProps,
} from '@material-ui/core';
import { FileManagerContext } from '~/lib/useFileManager';
import { WorkspaceContext } from '~/lib/useWorkspace';
import { DeleteForever, PlaylistPlay, Shuffle } from '@material-ui/icons';
import styled from 'styled-components';
import FolderDeleteDialog from './FolderDeleteDialog';
import useAlt from '~/lib/useAlt';
import _ from 'lodash';

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

const SaveButton = styled(Button).attrs({ variant: 'outlined', color: 'primary' })`
    margin: 0 0.75rem;
`;

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
            <IconButton {...props}>{icon}</IconButton>
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

    const altKey = useAlt();

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
                <Tooltip title="Pro tip: Enter the name of another folder to merge them!" placement="top">
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
                <IconButton onClick={startRenaming}>
                    <EditIcon color={renaming ? 'primary' : undefined} />
                </IconButton>
            </Tooltip>
            <Tooltip placement="left" title="Delete Folder" arrow>
                <IconButton onClick={onDeleteInitiate}>
                    <DeleteForever />
                </IconButton>
            </Tooltip>
        </ControlsContainer>
    );

    const onShuffle: MouseEventHandler = (ev) => {
        ev.stopPropagation();
        const pathToUse = up ? path : fullPath;
        const queue = _.shuffle(workspace.files.filter((f) => _.isEqual(f.path, pathToUse)).map((f) => f.id));
        workspace.resolver({
            playing: {
                timePlayed: 0,
                pauseTime: null,
                speed: 1,
                queue: queue,
            },
        });
        ev.stopPropagation();
    };

    const onPlayFolder: MouseEventHandler = (ev) => {
        ev.stopPropagation();
        const pathToUse = up ? path : fullPath;
        const queue = workspace.files.filter((f) => _.isEqual(f.path, pathToUse)).map((f) => f.id);
        console.log('Playing folder', queue);
        workspace.resolver({
            playing: {
                timePlayed: 0,
                pauseTime: null,
                speed: 1,
                queue: queue,
            },
        });
    };

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
                            {altKey ? (
                                <Tooltip placement="left" title="Shuffle folder">
                                    <IconButton onClick={onShuffle}>
                                        <Shuffle />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                <Tooltip placement="left" title="Play and loop folder">
                                    <IconButton onClick={onPlayFolder}>
                                        <PlaylistPlay />
                                    </IconButton>
                                </Tooltip>
                            )}
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
