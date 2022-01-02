/**
 * Explorer.tsx
 * ==============================
 * One of Audio HQ's main panels. Provides
 * file/folder operations with all the saved tracks,
 * as well as is the interface by which users may play music.
 */

import { Breadcrumbs, Button, Divider, IconButton, Paper, Tooltip } from '@material-ui/core';
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
import SearchBar from './SearchBar';
import useFavorites from '~/lib/useFavorites';
import { Favorite, FavoriteBorder, PlaylistPlay, Shuffle } from '@material-ui/icons';
import useAlt from '~/lib/useAlt';
import _ from 'lodash';

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
    margin-bottom: 1px;
`;

const BreadcrumbsContainer = styled.div`
    flex-grow: 1;
`;

const FileListContainer = styled.div`
    overflow-x: hidden;
    overflow-y: scroll;
    flex-grow: 1;
    position: relative;
    margin: 1px;
`;

const FileListScrollContainer = styled.div`
    height: 99%;
`;

const PlaceholderContainer = styled.div`
    margin: 0.5rem 1rem;
`;

const JobsContainer = styled.div`
    height: 250px;
    overflow: auto;
`;

/** Retrieves all WSFiles given a current path and an optional search string. */
const getFiles = (workspace: Workspace, path: string[], searchText?: string): WSFile[] => {
    const re = new RegExp(`.*${searchText}.*`, 'i');
    if (searchText !== undefined)
        return workspace.files.filter((file) => !!file.name.match(re) || !!file.description?.match(re));
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
    const favs = useFavorites();

    const [viewingFavorites, setViewingFavorites] = useState(false);
    const [path, setPath] = useRecoilState(pathAtom);
    const [combining, setCombining] = useState<WSFile[]>([]);

    const [searching, setSearching] = useState(false);
    const [searchText, setSearchText] = useState('');

    const altKey = useAlt();

    const currentFiles = viewingFavorites
        ? (favs.favorites
              .toArray()
              .map((id) => workspace.files.find((file) => file.id === id))
              .filter((file) => !!file) as WSFile[])
        : getFiles(workspace, path, searching ? searchText : undefined);

    const fileButtons = currentFiles.map((file, i) => <FileEntry file={file} index={i} key={file.id} />);

    const playCurrent = () => {
        let queue = currentFiles.map((f) => f.id);
        if (altKey) {
            queue = _.shuffle(queue);
        }
        workspace.resolver({
            playing: {
                pauseTime: null,
                queue: queue,
                speed: 1,
                timePlayed: 0,
            },
        });
    };

    // Finishes searching, optionally changing the current path to a selected folder.
    const finishSearch = (path?: string[]) => {
        setSearching(false);
        setSearchText('');
        if (path) setPath(path);
    };

    const folders = viewingFavorites
        ? []
        : searching
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
                    {viewingFavorites ? (
                        <Button>Favorites</Button>
                    ) : (
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>{breadcrumbs}</Breadcrumbs>
                    )}
                </BreadcrumbsContainer>
                {!viewingFavorites && (
                    <SearchBar
                        searching={searching}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        setSearching={(searching) => (searching ? setSearching(true) : finishSearch())}
                    />
                )}
                <Tooltip arrow placement="bottom" title="Show only favorites">
                    <IconButton onClick={() => setViewingFavorites(!viewingFavorites)}>
                        {viewingFavorites ? <Favorite color="primary" /> : <FavoriteBorder />}
                    </IconButton>
                </Tooltip>
                <Tooltip
                    arrow
                    placement="bottom"
                    title={altKey ? 'Shuffle folder' : 'Play and loop folder (alt/option to shuffle)'}
                >
                    <IconButton onClick={playCurrent}>{altKey ? <Shuffle /> : <PlaylistPlay />}</IconButton>
                </Tooltip>
            </ExplorerToolbar>
            <FolderAddDialog files={combining} cancel={() => setCombining([])} />

            <FileListContainer>
                <FileListScrollContainer>
                    <DragDropContext onDragEnd={handleDrag}>
                        {!searching && !viewingFavorites && path.length > 0 && (
                            <FolderEntry
                                name="Back"
                                up
                                path={path}
                                onClick={() => setPath(path.slice(0, path.length - 1))}
                            />
                        )}
                        {folders}
                        <Divider />
                        <Droppable isDropDisabled={viewingFavorites} isCombineEnabled droppableId="___current___">
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
            {runningJobs.size > 0 && (
                <JobsContainer>
                    <Divider />
                    {runningJobs}
                </JobsContainer>
            )}
        </ExplorerContainer>
    );
};
