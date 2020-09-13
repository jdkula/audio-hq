import { Breadcrumbs, Button, Divider, Paper } from '@material-ui/core';
import React, { FC, useContext, useState } from 'react';
import { WorkspaceContext } from '~/lib/useWorkspace';
import { File as WSFile, Workspace } from '~/lib/Workspace';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { FileManagerContext } from '~/lib/useFileManager';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { mutate } from 'swr';
import { Set, List } from 'immutable';
import FileEntry from './FileEntry';
import FolderAddDialog from './AddFolderDialog';
import FolderEntry from './FolderEntry';
import JobEntry from './JobEntry';
import { useRecoilState } from 'recoil';
import { pathAtom } from '~/lib/atoms';
import SearchArea from './SearchArea';

const ExplorerContainer = styled.div`
    grid-area: explorer;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const ExplorerToolbar = styled(Paper)`
    display: flex;
    align-items: center;
    padding: 0.5rem;
`;

const BreadcrumbsContainer = styled.div`
    flex-grow: 1;
`;

const FileListContainer = styled.div`
    overflow: hidden;
    flex-grow: 1;
    position: relative;
    margin: 1px;
`;

const FileListScrollContainer = styled.div`
    height: 100%;
    overflow: auto;
`;

const PlaceholderContainer = styled.div`
    margin: 0.5rem 1rem;
`;

const JobsContainer = styled.div`
    max-height: 200px;
    overflow: auto;
`;

/** Retrieves all WSFiles given a current path and an optional search string. */
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

/**
 * Given a search string, finds all folders that contain tracks matching that search string.
 * Folders are returned as full paths ending at that folder.
 */
const getSearchFolders = (workspace: Workspace, searchText: string): string[][] => {
    return [
        ...Set(
            workspace.files
                .map((file) => file.path)
                .filter((path) => path.length > 0)
                .filter((path) => path[path.length - 1].match(new RegExp(`.*${searchText}.*`, 'i')))
                .map((path) => List(path)), // deduplicate (immutable's lists get deduplicated in immutable sets)
        ).map((list) => [...list]), // convert to array
    ];
};

/**
 * Given a path, finds all child folders.
 */
const getFolders = (workspace: Workspace, currentPath: string[]): Set<string> => {
    return Set(
        workspace.files
            .filter((file) => file.path.length > currentPath.length && currentPath.every((v, i) => file.path[i] === v))
            .map((file) => file.path[currentPath.length]),
    ).sort();
};

export const Explorer: FC = () => {
    const workspace = useContext(WorkspaceContext);
    const fileManager = useContext(FileManagerContext);

    const [path, setPath] = useRecoilState(pathAtom);
    const [combining, setCombining] = useState<WSFile[]>([]);

    const [searching, setSearching] = useState(false);
    const [searchText, setSearchText] = useState('');

    const currentFiles = getFiles(workspace, path, searching ? searchText : undefined);

    const fileButtons = currentFiles.map((file, i) => <FileEntry file={file} index={i} key={file.id} />);

    // Finishes searching, optionally changing the current path to a selected folder.
    const finishSearch = (path?: string[]) => {
        setSearching(false);
        setSearchText('');
        if (path) setPath(path);
    };

    const folders = searching
        ? getSearchFolders(workspace, searchText).map((path, i) => (
              <FolderEntry
                  name={path[path.length - 1]}
                  path={path.slice(0, path.length - 1)}
                  key={i}
                  onClick={() => finishSearch(path)}
              />
          ))
        : getFolders(workspace, path).map((foldername) => (
              <FolderEntry
                  name={foldername}
                  key={foldername}
                  path={path}
                  onClick={() => setPath([...path, foldername])}
              />
          ));

    const runningJobs = fileManager.working.map((j) => (
        <JobEntry job={j} key={j.jobId} onCanceled={() => mutate(`/api/${workspace.name}/jobs`)} />
    ));

    const breadcrumbs = ['Home', ...path].map((el, i) => {
        const partial = path.slice(0, i);
        return (
            <Button key={i} onClick={() => setPath(partial)}>
                {el}
            </Button>
        );
    });

    const handleDrag = (result: DropResult) => {
        console.log('Drop', result);

        // The current list of files has a droppableId of ___current___
        // The folder entry going back has a droppableId of ___back___
        // All other folder entries have a droppableId of ___folder_Folder Name

        const srcFile = workspace?.files.find((file) => file.id === result.draggableId);

        if (!srcFile) throw new Error("You dragged something that wasn't a file, somehow??");

        // === Combining two files into a new folder ===
        if (result.combine?.droppableId === '___current___') {
            const destFile = workspace?.files.find((file) => file.id === result.combine?.draggableId);

            if (!destFile) throw new Error("Didn't combine with another file, somehow??");

            setCombining([srcFile, destFile]);
        } else if (result.destination?.droppableId === '___current___' && currentFiles.length > 1) {
            // === Reorder one file around the current folder ===
            const targetId = currentFiles[result.destination.index]?.id;
            const reorder = targetId ? { before: targetId } : { after: currentFiles[currentFiles.length - 1].id };
            fileManager.update(srcFile.id, { reorder });
        } else {
            // === Move one file into an existing folder ===
            if (!result.destination || result.destination.droppableId === '___current___') return;
            const folderName = result.destination.droppableId.replace(/^___folder_/, '');
            const destPath =
                folderName === '___back___'
                    ? srcFile.path.slice(0, srcFile.path.length - 1)
                    : [...srcFile.path, folderName];

            fileManager.update(srcFile.id, { path: destPath });
        }
    };

    return (
        <ExplorerContainer>
            <ExplorerToolbar square variant="elevation" color="primary">
                <BreadcrumbsContainer>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>{breadcrumbs}</Breadcrumbs>
                </BreadcrumbsContainer>
                <SearchArea
                    searching={searching}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    setSearching={(searching) => (searching ? setSearching(true) : finishSearch())}
                />
            </ExplorerToolbar>
            <FolderAddDialog files={combining} cancel={() => setCombining([])} />

            <FileListContainer>
                <FileListScrollContainer>
                    <DragDropContext onDragEnd={handleDrag}>
                        {!searching && path.length > 0 && (
                            <FolderEntry
                                name="Back"
                                up
                                path={[]}
                                onClick={() => setPath(path.slice(0, path.length - 1))}
                            />
                        )}
                        {folders}
                        <Divider />
                        <Droppable isCombineEnabled droppableId="___current___">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {fileButtons}
                                    <PlaceholderContainer>{provided.placeholder}</PlaceholderContainer>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </FileListScrollContainer>
            </FileListContainer>
            <JobsContainer>
                <Divider />
                {runningJobs}
            </JobsContainer>
        </ExplorerContainer>
    );
};
