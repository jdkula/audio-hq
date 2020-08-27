import {
    Box,
    Button,
    CircularProgress,
    CircularProgressProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    IconButton,
    Paper,
    TextField,
    Tooltip,
    Typography,
} from '@material-ui/core';
import React, { FC, SyntheticEvent, useContext, useState, KeyboardEvent } from 'react';
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
import { WorkspaceContext } from '../../pages/[id]/host';

export const FileContainer = styled(Paper)`
    display: grid;
    grid-template-columns: 4fr 1fr min-content;
    grid-template-rows: auto;
    margin: 0.5rem 1rem;
    border-radius: 9999px;
    padding: 0.25rem 0.25rem;
    transition: background-color 0.25s;
    align-content: center;
    align-items: center;
    min-height: 50px;

    &:hover {
        background-color: #eee;
    }
`;

const StatusContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const CircularProgressWithLabel: FC<CircularProgressProps & { value?: number }> = (props) =>
    props.value ? (
        <Box position="relative" display="inline-flex">
            <CircularProgress {...props} />
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
                <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    ) : (
        <CircularProgress {...props} />
    );

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

    const startEditing = () => {
        setEditName(file.name);
        setEditing(true);
    };

    const saveName = () => {
        setEditing(false);
        fileManager.update(file.id, {
            name: editName,
        });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.code === 'Enter') {
            e.preventDefault();
            saveName();
        }
        if (e.nativeEvent.code === 'Escape') {
            e.preventDefault();
            setEditName(file.name);
            setEditing(false);
        }
    };

    const download = async () => {
        fileManager.song(file.id);
    };

    const save = async () => {
        fileManager.song(file.id, (blob) => {
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
                {(provided) => (
                    <FileContainer {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        <Box display="flex" alignItems="center">
                            <Tooltip title="Play File" placement="left" arrow>
                                <IconButton onClick={onPlay}>
                                    <PlayArrow />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Play File As Ambience" placement="left" arrow>
                                <IconButton onClick={onAmbience}>
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                title={editing ? 'Press enter to save' : 'Double-click to edit'}
                                placement="top"
                                arrow
                            >
                                <Box display="flex" width="100%" onDoubleClick={startEditing}>
                                    {editing ? (
                                        <>
                                            <TextField
                                                fullWidth
                                                autoFocus
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />
                                            <Box mx={1}>
                                                <Button onClick={saveName} variant="outlined" color="primary">
                                                    Save
                                                </Button>
                                            </Box>
                                        </>
                                    ) : (
                                        <Typography variant="body1" component="span">
                                            {file.name || 'Untitled file...'}
                                        </Typography>
                                    )}
                                </Box>
                            </Tooltip>
                        </Box>
                        <Box textAlign="right" px={2}>
                            <Typography variant="body1">{toTimestamp(file.length)}</Typography>
                        </Box>
                        <StatusContainer>
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
                                        <SaveIcon />
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
                    </FileContainer>
                )}
            </Draggable>
        </>
    );
};

export default FileEntry;
