import React, { FC, KeyboardEvent, MouseEvent, useContext, useState } from 'react';
import FolderIcon from '@material-ui/icons/Folder';
import { Droppable } from 'react-beautiful-dnd';
import { FileContainer } from './FileEntry';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

import {
    Box,
    Button,
    IconButton,
    TextField,
    Tooltip,
    Typography,
    Dialog,
    DialogProps,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import { FileManagerContext } from '~/lib/useFileManager';
import { WorkspaceContext } from '~/pages/[id]';
import { DeleteForever } from '@material-ui/icons';

const DeleteDialog: FC<DialogProps & { folder: string; onConfirm: () => void }> = ({ folder, onConfirm, ...props }) => {
    const doDelete = () => {
        onConfirm();
        props.onClose?.({}, 'escapeKeyDown');
    };

    return (
        <Dialog {...props}>
            <DialogTitle>Really delete {folder}?</DialogTitle>
            <DialogContent dividers>This will dump all the folder contents into the current folder.</DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose?.({}, 'escapeKeyDown')}>Cancel</Button>
                <Button color="secondary" onClick={doDelete}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
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
            setNewName(name);
            setRenaming(false);
        }
    };

    const onDeleteInitiate = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setDeleting(true);
    };

    return (
        <Droppable droppableId={up ? '___back___' : `___folder_${name}`}>
            {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    <DeleteDialog
                        folder={name}
                        onConfirm={onDelete}
                        open={deleting}
                        onClose={() => setDeleting(false)}
                    />
                    <FileContainer onClick={onClick} style={{ cursor: 'pointer' }}>
                        <Box display="flex" alignItems="center">
                            <Tooltip title="Click to enter folder" placement="left">
                                <IconButton onClick={onClick}>
                                    {snapshot.isDraggingOver ? (
                                        <FolderOpenIcon color="primary" />
                                    ) : up ? (
                                        <ArrowBackIcon />
                                    ) : (
                                        <FolderIcon />
                                    )}
                                </IconButton>
                            </Tooltip>
                            {up ? (
                                <Typography variant="body1" component="span">
                                    {name}
                                </Typography>
                            ) : renaming ? (
                                <Box display="flex" width="100%" onClick={(e) => e.stopPropagation()}>
                                    <Tooltip
                                        title="Pro tip: Enter the name of another folder to merge them!"
                                        placement="top"
                                    >
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </Tooltip>

                                    <Box mx={1}>
                                        <Button onClick={onRename} variant="outlined" color="primary">
                                            Save
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Typography variant="body1" component="span">
                                    {name || 'Untitled Folder...'}
                                </Typography>
                            )}
                        </Box>
                        <div style={{ display: 'none' }}>{provided.placeholder}</div>
                        {!up && (
                            <Box justifySelf="end" display="flex" flexWrap="nowrap">
                                <Tooltip placement="left" title="Rename" arrow>
                                    <IconButton onClick={startRenaming}>
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip placement="left" title="Delete Folder" arrow>
                                    <IconButton onClick={onDeleteInitiate}>
                                        <DeleteForever />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </FileContainer>
                </div>
            )}
        </Droppable>
    );
};

export default FolderEntry;
