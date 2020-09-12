import {
    Box,
    Breadcrumbs,
    Button,
    Divider,
    Fab,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Tooltip,
} from '@material-ui/core';
import React, { FunctionComponent, useCallback, useContext, useState } from 'react';
import { WorkspaceContext } from '~/pages/[id]';
import { File as WSFile, Workspace } from '~/lib/Workspace';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';

import { FileManagerContext } from '~/lib/useFileManager';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Axios from 'axios';
import { mutate } from 'swr';
import { Set, List } from 'immutable';
import FileEntry from './FileEntry';
import FolderAddDialog from './AddFolderDialog';
import FolderEntry from './FolderEntry';
import JobEntry from './JobEntry';
import { useRecoilState } from 'recoil';
import { pathAtom } from '~/lib/atoms';

const ExplorerContainer = styled.div`
    grid-area: explorer;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const getFiles = (workspace: Workspace, path: string[], searchText?: string): WSFile[] => {
    if (searchText !== undefined)
        return workspace.files.filter(
            (file) =>
                !!file.name.match(new RegExp(`.*${searchText}.*`, 'i')) ||
                !!file.description?.match(new RegExp(`.*${searchText}.*`, 'i')),
        );
    return (
        workspace.files.filter(
            (file) => file.path.length === path.length && path.every((v, i) => file.path[i] === v),
        ) ?? []
    );
};

const getSearchFolders = (workspace: Workspace, searchText: string): string[][] => {
    return [
        ...Set(
            workspace.files
                .map((file) => file.path)
                .filter((path) => path.length > 0)
                .filter((path) => path[path.length - 1].match(new RegExp(`.*${searchText}.*`, 'i')))
                .map((path) => List(path)), // deduplicate
        ).map((list) => [...list]),
    ];
};

const getFolders = (workspace: Workspace, path: string[]): Set<string> => {
    return Set(
        workspace.files
            .filter((file) => file.path.length > path.length && path.every((v, i) => file.path[i] === v))
            .map((file) => file.path[path.length]),
    ).sort();
};

export const Explorer: FunctionComponent = (props) => {
    const workspace = useContext(WorkspaceContext);
    const fileManager = useContext(FileManagerContext);

    const [path, setPath] = useRecoilState(pathAtom);
    const [combining, setCombining] = useState<WSFile[]>([]);

    const [searching, setSearching] = useState(false);
    const [searchText, setSearchText] = useState('');

    const currentFiles = getFiles(workspace, path, searching ? searchText : undefined);

    const fileButtons = currentFiles.map((file, i) => <FileEntry file={file} index={i} key={file.id} />);

    const finishSearch = (path?: string[]) => {
        setSearching(false);
        setSearchText('');
        if (path) setPath(path);
    };

    const searchFolders = !searching
        ? null
        : getSearchFolders(workspace, searchText).map((path, i) => (
              <FolderEntry
                  name={path[path.length - 1]}
                  path={path.slice(0, path.length - 1)}
                  key={i}
                  onClick={() => finishSearch(path)}
              />
          ));

    const folders = getFolders(workspace, path).map((foldername) => (
        <FolderEntry name={foldername} key={foldername} path={path} onClick={() => setPath([...path, foldername])} />
    ));

    const jobNotes = fileManager.working.map((j) => (
        <JobEntry job={j} key={j.jobId} onCanceled={() => mutate(`/api/${workspace.name}/jobs`)} />
    ));

    const handleDrag = (result: DropResult) => {
        console.log('Drop', result);

        const srcFile = workspace?.files.find((file) => file.id === result.draggableId);

        if (!srcFile) throw new Error('rip');

        if (result.combine?.droppableId === '___current___') {
            const destFile = workspace?.files.find((file) => file.id === result.combine?.draggableId);

            if (!destFile) throw new Error('rip');

            setCombining([srcFile, destFile]);
        } else if (result.destination?.droppableId === '___current___' && currentFiles.length > 1) {
            const targetId = currentFiles[result.destination.index]?.id;
            const reorder = targetId ? { before: targetId } : { after: currentFiles[currentFiles.length - 1].id };
            fileManager.update(srcFile.id, { reorder });
        } else {
            if (!result.destination || result.destination.droppableId === '___current___') return;
            // folder
            const folderName = result.destination.droppableId.replace(/^___folder_/, '');
            const destPath =
                folderName === '___back___'
                    ? srcFile.path.slice(0, srcFile.path.length - 1)
                    : [...srcFile.path, folderName];

            fileManager.update(srcFile.id, { path: destPath });
        }
    };

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
                <Box display="flex" alignItems="center" p="0.5rem">
                    <Box flexGrow={1}>
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>{breadcrumbs}</Breadcrumbs>
                    </Box>
                    <Box>
                        {searching ? (
                            <Box display="flex" alignItems="center">
                                <TextField
                                    id="search-bar"
                                    autoFocus
                                    variant="filled"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    label="Search..."
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Tooltip placement="bottom" title="Close search" arrow>
                                    <IconButton onClick={() => finishSearch()}>
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ) : (
                            <Tooltip placement="left" title="Search all files and folders" arrow>
                                <IconButton onClick={() => setSearching(true)}>
                                    <SearchIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            </Paper>
            <Box m="1px" />
            <FolderAddDialog files={combining} cancel={() => setCombining([])} />

            <Box overflow="hidden" flexGrow={1} position="relative">
                <Box height="100%" overflow="auto">
                    <DragDropContext onDragEnd={handleDrag}>
                        {!searching && path.length > 0 && (
                            <FolderEntry
                                name="Back"
                                up
                                path={[]}
                                onClick={() => setPath(path.slice(0, path.length - 1))}
                            />
                        )}
                        {searching ? searchFolders : folders}
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
            </Box>
            <Divider />
            <Box style={{ maxHeight: '200px', overflow: 'auto' }}>{jobNotes}</Box>
        </ExplorerContainer>
    );
};
