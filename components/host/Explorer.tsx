import { Box, Breadcrumbs, Button, Divider, Fab, Paper } from '@material-ui/core';
import React, { FunctionComponent, useCallback, useContext, useState } from 'react';
import { WorkspaceContext } from '~/pages/[id]/host';
import { File as WSFile } from '~/lib/Workspace';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AddIcon from '@material-ui/icons/Add';

import { FileManagerContext } from '~/lib/useFileManager';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Axios from 'axios';
import { mutate } from 'swr';
import { Set } from 'immutable';
import AddFileDialog from './AddFileDialog';
import FileEntry from './FileEntry';
import FolderAddDialog from './FolderAddDialog';
import FolderEntry from './FolderEntry';
import JobEntry from './JobEntry';

const ExplorerContainer = styled.div`
    grid-area: explorer;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
`;

export const Explorer: FunctionComponent = (props) => {
    const workspace = useContext(WorkspaceContext);
    const fileManager = useContext(FileManagerContext);

    const [path, setPath] = useState<string[]>([]);
    const [combining, setCombining] = useState<WSFile[]>([]);
    const [adding, setAdding] = useState(false);

    const currentFiles =
        workspace?.files.filter(
            (file) => file.path.length === path.length && path.every((v, i) => file.path[i] === v),
        ) ?? [];

    const fileButtons = currentFiles.map((file, i) => <FileEntry file={file} index={i} key={file.id} />);

    const folders = Set(
        workspace.files
            .filter((file) => file.path.length > path.length && path.every((v, i) => file.path[i] === v))
            .map((file) => file.path[path.length]),
    )
        .sort()
        .map((foldername) => (
            <FolderEntry name={foldername} key={foldername} onClick={() => setPath([...path, foldername])} />
        ));

    const jobNotes = fileManager.working.map((j) => (
        <JobEntry job={j} key={j.jobId} onCanceled={() => mutate(`/api/${workspace.name}/jobs`)} />
    ));

    const handleDrag = useCallback(
        (result: DropResult) => {
            console.log('Drop', result);

            const srcFile = workspace?.files.find((file) => file.id === result.draggableId);

            if (!srcFile) throw new Error('rip');

            if (result.combine?.droppableId === '___current___') {
                const destFile = workspace?.files.find((file) => file.id === result.combine?.draggableId);

                if (!destFile) throw new Error('rip');

                setCombining([srcFile, destFile]);
            } else if (result.destination?.droppableId === '___current___') {
                const targetId = currentFiles[result.destination.index]?.id;
                const reorder = targetId ? { before: targetId } : { after: currentFiles[currentFiles.length - 1].id };
                fileManager.update(srcFile.id, { reorder });
            } else {
                if (!result.destination || result.destination.droppableId === '___current___') return;
                // folder
                const folderName = result.destination.droppableId;
                const destPath =
                    folderName === '___back___'
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
            <Box m="1px" />
            <FolderAddDialog files={combining} cancel={() => setCombining([])} />
            <AddFileDialog open={adding} onClose={() => setAdding(false)} />

            <Box overflow="hidden" flexGrow={1} position="relative">
                <Box height="100%" overflow="auto">
                    <DragDropContext onDragEnd={handleDrag}>
                        {path.length > 0 && (
                            <FolderEntry name="Back" up onClick={() => setPath(path.slice(0, path.length - 1))} />
                        )}
                        {folders}
                        <Divider />
                        <Droppable isCombineEnabled droppableId="___current___">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {fileButtons}
                                    <div style={{ margin: '0.5rem 1rem' }}>{provided.placeholder}</div>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Box>
                <Box position="absolute" right="4rem" bottom="4rem">
                    <Fab color="secondary" variant="extended" size="large" onClick={() => setAdding(true)}>
                        <AddIcon />
                        Add A Song
                    </Fab>
                </Box>
            </Box>
            <Divider />
            <Box>{jobNotes}</Box>
        </ExplorerContainer>
    );
};
