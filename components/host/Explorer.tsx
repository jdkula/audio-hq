import {
    Button,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    Typography,
    DialogActions,
    DialogContent,
    Toolbar,
    Breadcrumbs,
    Paper,
    ModalProps,
    DialogProps,
} from '@material-ui/core';
import { useContext, FunctionComponent, FC, useState, useCallback, SyntheticEvent } from 'react';
import { WorkspaceContext } from '~/pages/[id]/host';
import { File as WSFile } from '~/lib/Workspace';

import PlayArrow from '@material-ui/icons/PlayArrow';
import DeleteForever from '@material-ui/icons/DeleteForever';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import FolderIcon from '@material-ui/icons/Folder';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import DownloadIcon from '@material-ui/icons/CloudDownload';

import { FileManagerContext } from '~/lib/useFileManager';
import { DragDropContext, DropResult, ResponderProvided, Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Axios from 'axios';
import { mutate } from 'swr';
import { Set } from 'immutable';
import { useDropzone } from 'react-dropzone';

const FileContainer = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr min-content;
    grid-template-rows: auto;
`;

const StatusContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Folder: FC<{ name: string; onClick: () => void }> = ({ name, onClick }) => (
    <Droppable droppableId={name} key={name}>
        {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
                <div onClick={onClick}>
                    <FolderIcon />
                    {name} {provided.placeholder}
                </div>
            </div>
        )}
    </Droppable>
);

const FileEntry: FC<{ file: WSFile; onPlay: () => void; onDelete: () => void; index: number }> = ({
    file,
    onPlay,
    onDelete,
    index,
}) => {
    const fileManager = useContext(FileManagerContext);

    const cached = fileManager.cached.has(file.id);
    const downloadJob = fileManager.fetching.find((job) => ((job.jobId as unknown) as string) === file.id);

    const progress = Math.ceil((downloadJob?.progress ?? 0) * 100);

    return (
        <Draggable draggableId={file.id} index={index}>
            {(provided, snapshot) => (
                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <FileContainer>
                        <div>
                            <MusicNoteIcon />
                            <span>{file.name}</span>
                        </div>
                        <div>
                            {cached && <span>Cached</span>}
                            {downloadJob && <span>Downloading... {progress}%</span>}
                        </div>
                        <StatusContainer>
                            <IconButton onClick={onPlay}>
                                <PlayArrow />
                            </IconButton>
                            <IconButton
                                onClick={() =>
                                    window.open(`/api/files/${file.id}/download`, '_blank', 'norel noreferrer')
                                }
                            >
                                <DownloadIcon />
                            </IconButton>
                            <IconButton onClick={onDelete}>
                                <DeleteForever />
                            </IconButton>
                        </StatusContainer>
                    </FileContainer>
                </div>
            )}
        </Draggable>
    );
};

const FolderAddDialog: FC<{ files: WSFile[]; cancel: () => void }> = ({ files, cancel }) => {
    const [name, setName] = useState('');
    const workspace = useContext(WorkspaceContext);

    const doCancel = () => {
        setName('');
        cancel();
    };

    const addFilesToFolder = async () => {
        doCancel();
        await Promise.all(
            files.map(async (file) => Axios.put(`/api/files/${file.id}`, { path: [...file.path, name] })),
        );
        if (workspace) mutate(`/api/${workspace.name}/files`);
    };

    return (
        <Dialog open={files.length > 0}>
            <DialogTitle>
                <Typography variant="h4">Add Folder</Typography>
            </DialogTitle>
            <DialogContent>
                <TextField value={name} onChange={(e) => setName(e.target.value)} label="Folder Name" />
            </DialogContent>
            <DialogActions>
                <Button onClick={doCancel}>Cancel</Button>
                <Button onClick={addFilesToFolder}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

const AddFileDialog: FC<DialogProps> = (props) => {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');

    const fileManager = useContext(FileManagerContext);
    const workspace = useContext(WorkspaceContext);

    const doClose = () => {
        setUrl('');
        setName('');
        props.onClose?.({}, 'escapeKeyDown');
    };

    const onUpload = () => {
        fileManager.import(workspace.name, name, url);
        doClose();
    };

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        fileManager.upload(workspace.name, name, acceptedFiles[0]);
        doClose();
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <Dialog {...props}>
            <DialogTitle>Add a track!</DialogTitle>
            <DialogContent>
                <TextField value={name} onChange={(e) => setName(e.target.value)} label="Name" />

                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the files here ...</p>
                    ) : (
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    )}
                </div>

                <div> - or - </div>

                <TextField value={url} onChange={(e) => setUrl(e.target.value)} label="URL" />
            </DialogContent>
            <DialogActions>
                <Button onClick={onUpload}>Upload</Button>
            </DialogActions>
        </Dialog>
    );
};

export const Explorer: FunctionComponent<{
    setSong: (id: string) => void;
}> = (props) => {
    const workspace = useContext(WorkspaceContext);
    const fileManager = useContext(FileManagerContext);

    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [path, setPath] = useState<string[]>([]);
    const [combining, setCombining] = useState<WSFile[]>([]);
    const [adding, setAdding] = useState(false);

    const doPlay = (fileId: string) => {
        return () => {
            props.setSong(fileId);
        };
    };

    const fileButtons = workspace?.files
        .filter((file) => file.path.length === path.length && path.every((v, i) => file.path[i] === v))
        .map((file, i) => (
            <FileEntry
                file={file}
                index={i}
                onPlay={doPlay(file.id)}
                onDelete={() => fileManager.delete(file.id, workspace.name)}
                key={file.id}
            />
        ));

    const folders = Set(
        workspace.files
            .filter((file) => file.path.length > path.length && path.every((v, i) => file.path[i] === v))
            .map((file) => file.path[path.length]),
    ).map((foldername) => <Folder name={foldername} key={foldername} onClick={() => setPath([...path, foldername])} />);

    const jobNotes = fileManager.working.map((j) => (
        <div key={(j.jobId as unknown) as string}>
            {j.name} - {j.status} - {Math.floor((j.progress ?? 0) * 1000) / 10}%
        </div>
    ));

    const handleDrag = useCallback(
        (result: DropResult, provided: ResponderProvided) => {
            console.log('Drop', result);

            const srcFile = workspace?.files.find((file) => file.id === result.draggableId);

            if (!srcFile) throw new Error('rip');

            if (result.combine?.droppableId === '___current___') {
                if (!result.combine) return;
                const destFile = workspace?.files.find((file) => file.id === result.combine?.draggableId);

                if (!destFile) throw new Error('rip');

                setCombining([srcFile, destFile]);
            } else {
                if (!result.destination || result.destination.droppableId === '___current___') return;
                // folder
                const folderName = result.destination.droppableId;
                const destPath =
                    folderName === '..'
                        ? srcFile.path.slice(0, srcFile.path.length - 1)
                        : [...srcFile.path, folderName];
                Axios.put(`/api/files/${srcFile.id}`, { path: destPath }).then(
                    () => workspace && mutate(`/api/${workspace.name}/files`),
                );
            }
        },
        [workspace],
    );

    const breadcrumbs = ['', ...path].map((el, i) => {
        const partial = path.slice(0, i);
        el = el || 'Home';
        return (
            <Button key={i} onClick={() => setPath(partial)}>
                {el}
            </Button>
        );
    });

    return (
        <div style={{ gridArea: 'explorer' }}>
            <Paper square variant="elevation" color="primary">
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>{breadcrumbs}</Breadcrumbs>
            </Paper>
            <FolderAddDialog files={combining} cancel={() => setCombining([])} />
            <AddFileDialog open={adding} onClose={() => setAdding(false)} />
            <DragDropContext onDragEnd={handleDrag}>
                {path.length > 0 && <Folder name=".." onClick={() => setPath(path.slice(0, path.length - 1))} />}
                {folders}
                <Droppable isCombineEnabled droppableId="___current___">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {fileButtons}

                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                {jobNotes}
            </DragDropContext>
            <Button variant="outlined" color="primary" onClick={() => setAdding(true)}>
                Add
            </Button>
        </div>
    );
};
