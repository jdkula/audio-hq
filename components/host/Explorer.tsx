import { Button, Breadcrumbs, Paper } from '@material-ui/core';
import React, { useContext, FunctionComponent, useState, useCallback } from 'react';
import { WorkspaceContext } from '~/pages/[id]/host';
import { File as WSFile } from '~/lib/Workspace';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { FileManagerContext } from '~/lib/useFileManager';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Axios from 'axios';
import { mutate } from 'swr';
import { Set } from 'immutable';
import AddFileDialog from './AddFileDialog';
import FileEntry from './FileEntry';
import FolderAddDialog from './FolderAddDialog';
import Folder from './FolderEntry';
import JobEntry from './JobEntry';

const ExplorerContainer = styled.div`
    grid-area: explorer;
    border: 1px solid black;
`;

export const Explorer: FunctionComponent<{
    setSong: (id: string) => void;
}> = (props) => {
    const workspace = useContext(WorkspaceContext);
    const fileManager = useContext(FileManagerContext);

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
                onDelete={() => fileManager.delete(file.id)}
                key={file.id}
            />
        ));

    const folders = Set(
        workspace.files
            .filter((file) => file.path.length > path.length && path.every((v, i) => file.path[i] === v))
            .map((file) => file.path[path.length]),
    ).map((foldername) => <Folder name={foldername} key={foldername} onClick={() => setPath([...path, foldername])} />);

    const jobNotes = fileManager.working.map((j) => (
        <JobEntry job={j} key={j.jobId} onCanceled={() => mutate(`/api/${workspace.name}/jobs`)} />
    ));

    const handleDrag = useCallback(
        (result: DropResult) => {
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
        <ExplorerContainer>
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
        </ExplorerContainer>
    );
};
