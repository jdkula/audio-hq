import {
    Box,
    Button,
    CircularProgress,
    CircularProgressProps,
    ClickAwayListener,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    Divider,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography,
    TypographyProps,
} from '@material-ui/core';
import React, { FC, SyntheticEvent, useContext, useState, KeyboardEvent, forwardRef } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FileManagerContext } from '~/lib/useFileManager';
import { File as WSFile } from '~/lib/Workspace';
import styled from 'styled-components';

import PlayArrow from '@material-ui/icons/PlayArrow';
import AddIcon from '@material-ui/icons/Add';
import DeleteForever from '@material-ui/icons/DeleteForever';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import SaveIcon from '@material-ui/icons/Save';
import { toTimestamp } from './AudioControls';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import EditIcon from '@material-ui/icons/Edit';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';

import { WorkspaceContext } from '../../pages/[id]';

export const FileContainer = styled(Paper)`
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto;
    grid-template-areas: 'playcontrols details filecontrols';

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

    ${({ theme }) => theme.breakpoints.down('xs')} {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        grid-template-areas:
            'playcontrols filecontrols'
            'details      details';
        padding: 1rem 2rem;
    }
`;

const StatusContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto;
    align-items: flex-end;
    justify-items: center;
`;

const DetailsContainer = styled.div`
    display: flex;
    align-items: center;
    grid-area: details;

    padding: 0.33rem 1rem;
`;

export const CircularProgressWithLabel: FC<
    CircularProgressProps & { textColor?: TypographyProps['color'] }
> = forwardRef(({ textColor, ...props }, ref) =>
    props.value !== undefined ? (
        <Box position="relative" display="inline-flex">
            <CircularProgress {...props} ref={ref} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" component="div" color={textColor || 'textSecondary'}>{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    ) : (
        <CircularProgress ref={ref} {...props} />
    ),
);
CircularProgressWithLabel.displayName = 'CircularProgressWithLabel';

const CircularProgressVisibleBackground = styled(CircularProgressWithLabel)`
    //& .circle {
    //    color: #ddd;
    //}
`;

const DeleteDialog: FC<DialogProps & { file: WSFile }> = ({ file, ...props }) => {
    const fileManager = useContext(FileManagerContext);

    const doDelete = () => {
        fileManager.delete(file.id);
        props.onClose?.({}, 'escapeKeyDown');
    };

    return (
        <Dialog {...props}>
            <DialogTitle>Really delete {file.name}?</DialogTitle>
            <DialogContent dividers>This is irreversable.</DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose?.({}, 'escapeKeyDown')}>Cancel</Button>
                <Button color="secondary" onClick={doDelete}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const FileEntry: FC<{ file: WSFile; index: number }> = ({ file, index }) => {
    const fileManager = useContext(FileManagerContext);
    const workspace = useContext(WorkspaceContext);

    const cached = fileManager.cached.has(file.id);
    const downloadJob = fileManager.fetching.find((job) => ((job.jobId as unknown) as string) === file.id);
    const [showDelete, setDelete] = useState(false);

    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(file.name);
    const [editDescription, setEditDescription] = useState(file.description);
    const [autoFocusTitle, setAutoFocusTitle] = useState(true);

    const startEditing = (withTitle = true) => {
        setEditName(file.name);
        setEditDescription(file.description);
        setEditing(true);
        setAutoFocusTitle(withTitle);
    };

    const saveEdits = () => {
        setEditing(false);
        setAutoFocusTitle(true);
        fileManager.update(file.id, {
            name: editName,
            description: editDescription,
        });
    };

    const cancelEdits = () => {
        setEditName(file.name);
        setEditDescription(file.description);
        setEditing(false);
        setAutoFocusTitle(true);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.code === 'Enter') {
            e.preventDefault();
            saveEdits();
        } else if (e.nativeEvent.code === 'Escape') {
            e.preventDefault();
            cancelEdits();
        }
    };

    const download = async () => {
        fileManager.track(file.id);
    };

    const save = async () => {
        fileManager.track(file.id, (blob) => {
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank', 'norel noreferrer');
        });
    };

    const onAmbience = async () => {
        workspace.resolver({ ambience: { id: file.id, startTimestamp: Date.now(), pauseTime: null } });
    };

    const onPlay = async () => {
        workspace.resolver({ playing: { id: file.id, startTimestamp: Date.now(), pauseTime: null } });
    };

    return (
        <>
            <DeleteDialog open={showDelete} file={file} onClose={() => setDelete(false)} />
            <Draggable draggableId={file.id} index={index}>
                {(provided, snapshot) => (
                    <FileContainer {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        <Box display="flex" alignItems="center" justifyItems="center" gridArea="playcontrols">
                            <Tooltip title="Play File" placement="left" arrow>
                                <IconButton onClick={onPlay}>
                                    {snapshot.combineTargetFor ? (
                                        <CreateNewFolderIcon color="primary" />
                                    ) : (
                                        <PlayArrow
                                            color={workspace.state.playing?.id === file.id ? 'primary' : undefined}
                                        />
                                    )}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Play File As Ambience" placement="left" arrow>
                                <IconButton onClick={onAmbience}>
                                    <AddIcon
                                        color={
                                            workspace.state.ambience.find((ps) => ps.id === file.id)
                                                ? 'primary'
                                                : undefined
                                        }
                                    />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <DetailsContainer>
                            <Box display="flex" alignItems="center" flexGrow={1}>
                                {editing ? (
                                    <ClickAwayListener onClickAway={cancelEdits}>
                                        <Box display="flex" alignItems="center" flexGrow={1}>
                                            <Box display="flex" flexDirection="column" flexGrow={1}>
                                                <TextField
                                                    id={file.id + '-title'}
                                                    fullWidth
                                                    autoFocus={autoFocusTitle}
                                                    variant="outlined"
                                                    label="Title"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                />
                                                <Box m={0.5} />
                                                <TextField
                                                    id={file.id + '-description'}
                                                    fullWidth
                                                    autoFocus={!autoFocusTitle}
                                                    size="small"
                                                    variant="outlined"
                                                    label="Description"
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                />
                                            </Box>
                                            <Divider variant="middle" orientation="vertical" flexItem />
                                            <Box display="flex" flexDirection="column" alignItems="center">
                                                <Box mb={0.5} width="100%">
                                                    <Button
                                                        fullWidth
                                                        onClick={saveEdits}
                                                        variant="outlined"
                                                        color="primary"
                                                    >
                                                        Save
                                                    </Button>
                                                </Box>
                                                <Button fullWidth onClick={cancelEdits} variant="outlined">
                                                    Cancel
                                                </Button>
                                            </Box>
                                        </Box>
                                    </ClickAwayListener>
                                ) : (
                                    <Box display="flex" flexDirection="column" style={{ cursor: 'text' }}>
                                        <Typography
                                            variant="body1"
                                            component="span"
                                            onDoubleClick={() => startEditing(true)}
                                        >
                                            {file.name || 'Untitled file...'}
                                        </Typography>
                                        {file.description && (
                                            <Typography variant="caption" onDoubleClick={() => startEditing(false)}>
                                                {file.description}
                                            </Typography>
                                        )}
                                    </Box>
                                )}
                            </Box>
                            <Box pl="1rem" textAlign="right" style={{ flexGrow: editing ? undefined : 1 }}>
                                <Typography variant="body1">{toTimestamp(file.length)}</Typography>
                            </Box>
                        </DetailsContainer>
                        <Box display="flex" justifyContent="flex-end">
                            <StatusContainer>
                                <Tooltip placement="left" title="Rename" arrow>
                                    <IconButton onClick={() => (editing ? cancelEdits() : startEditing())}>
                                        <EditIcon color={editing ? 'primary' : undefined} />
                                    </IconButton>
                                </Tooltip>
                                {downloadJob && (
                                    <Tooltip placement="left" title="Downloading..." arrow>
                                        {downloadJob.progress ? (
                                            <CircularProgressVisibleBackground
                                                variant="static"
                                                value={downloadJob.progress * 100}
                                            />
                                        ) : (
                                            <CircularProgressVisibleBackground />
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

                                <Tooltip placement="left" title="Delete" arrow>
                                    <IconButton onClick={() => setDelete(true)}>
                                        <DeleteForever />
                                    </IconButton>
                                </Tooltip>
                            </StatusContainer>
                        </Box>
                    </FileContainer>
                )}
            </Draggable>
        </>
    );
};

export default FileEntry;
