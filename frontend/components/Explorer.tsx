/**
 * Explorer.tsx
 * ==============================
 * One of Audio HQ's main panels. Provides
 * file/folder operations with all the saved tracks,
 * as well as is the interface by which users may play music.
 */

import { Breadcrumbs, Button, Divider, IconButton, Paper, Tooltip } from '@mui/material';
import React, { FC, useContext, useState } from 'react';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import { List, Set } from 'immutable';
import FileEntry from './FileEntry';
import FolderAddDialog from './AddFolderDialog';
import FolderEntry from './FolderEntry';
import JobEntry from './JobEntry';
import { useRecoilState } from 'recoil';
import { pathAtom } from '~/lib/atoms';
import SearchBar from './SearchBar';
import { Favorite, FavoriteBorder, PlaylistPlay, Shuffle } from '@mui/icons-material';
import _ from 'lodash';
import { nonNull, useAlt, useFavorites, WorkspaceIdContext } from '../lib/utility';
import { File_Minimum } from '../lib/graphql_type_helper';
import {
    Play_Status_Type_Enum_Enum,
    usePlayTrackMutation,
    useUpdateFileMutation,
    useWorkspaceFilesSubscription,
} from '../lib/generated/graphql';
import useFileManager from '../lib/useFileManager';

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
const getFiles = (files: File_Minimum[], path: string[], searchText?: string): File_Minimum[] => {
    const re = new RegExp(`.*${searchText}.*`, 'i');
    if (searchText !== undefined) return files.filter((file) => !!file.name.match(re) || !!file.description?.match(re));
    return files.filter((file) => file.path.length === path.length && path.every((v, i) => file.path[i] === v)) ?? [];
};

/**
 * Given a search string, finds all folders that contain tracks matching that search string.
 * Folders are returned as full paths ending at that folder.
 */
const getSearchFolders = (files: File_Minimum[], searchText: string): string[][] => {
    return [
        ...Set(
            files
                .map((file) => file.path)
                .filter((path) => path.length > 0)
                .filter((path) => path[path.length - 1].match(new RegExp(`.*${searchText}.*`, 'i')))
                .map((path) => List(path as string[])), // deduplicate (immutable's lists get deduplicated in immutable sets)
        ).map((list) => [...list]), // convert to array
    ];
};

/**
 * Given a path, finds all child folders.
 */
const getFolders = (files: File_Minimum[], currentPath: string[]): Set<string> => {
    return Set(
        files
            .filter((file) => file.path.length > currentPath.length && currentPath.every((v, i) => file.path[i] === v))
            .map((file) => file.path[currentPath.length]),
    ).sort();
};

export const Explorer: FC = () => {
    const workspaceId = useContext(WorkspaceIdContext);

    const favs = useFavorites();
    const [viewingFavorites, setViewingFavorites] = useState(false);
    const [path, setPath] = useRecoilState(pathAtom);
    const [combining, setCombining] = useState<File_Minimum[]>([]);

    const [searching, setSearching] = useState(false);
    const [searchText, setSearchText] = useState('');

    const altKey = useAlt();

    const fileManager = useFileManager(workspaceId);

    const [{ data: filesRaw }] = useWorkspaceFilesSubscription({ variables: { workspaceId } });
    const files = filesRaw?.file ?? [];

    const [, playTrack] = usePlayTrackMutation();
    const [, updateFile] = useUpdateFileMutation();

    const currentFiles = viewingFavorites
        ? favs.favorites
              .toArray()
              .map((id) => files.find((file) => file.id === id))
              .filter<File_Minimum>(nonNull)
        : getFiles(files, path, searching ? searchText : undefined);

    const fileButtons = currentFiles.map((file, i) => <FileEntry file={file} index={i} key={file.id} />);

    const playCurrent = () => {
        let queue = currentFiles.map((f) => f.id);
        if (altKey) {
            queue = _.shuffle(queue);
        }
        playTrack({
            track: {
                workspace_id: workspaceId,
                speed: 1,
                start_timestamp: new Date(),
                pause_timestamp: null,
                type: Play_Status_Type_Enum_Enum.Main,
                queue: { data: queue.map((id) => ({ file_id: id })) },
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
        ? getSearchFolders(files, searchText).map((path, i) => (
              <FolderEntry
                  name={path[path.length - 1]}
                  path={path.slice(0, path.length - 1)}
                  key={i}
                  onClick={() => finishSearch(path)}
              />
          ))
        : getFolders(files, path).map((foldername) => (
              <FolderEntry
                  name={foldername}
                  key={foldername}
                  path={path}
                  onClick={() => setPath([...path, foldername])}
              />
          ));

    // TODO oncancelled
    const runningJobs = [...fileManager.jobs.values()].map((j) => <JobEntry job={j} key={j.id} />);

    const breadcrumbs = ['Home', ...path].map((el, i) => {
        const partial = path.slice(0, i);
        return (
            <Button key={i} onClick={() => setPath(partial)} color={i === path.length ? 'primary' : 'inherit'}>
                {el}
            </Button>
        );
    });

    const handleDrag = (result: DropResult) => {
        console.log('Drop', result);

        // The current list of files has a droppableId of ___current___
        // The folder entry going back has a droppableId of ___back___
        // All other folder entries have a droppableId of ___folder_Folder Name

        const srcFile = files.find((file) => file.id === result.draggableId);

        if (!srcFile) throw new Error("You dragged something that wasn't a file, somehow??");

        // === Combining two files into a new folder ===
        if (result.combine?.droppableId === '___current___') {
            const destFile = files.find((file) => file.id === result.combine?.draggableId);

            if (!destFile) throw new Error("Didn't combine with another file, somehow??");

            setCombining([srcFile, destFile]);
        } else if (result.destination?.droppableId === '___current___' && currentFiles.length > 1) {
            // === Reorder one file around the current folder ===
            const target = currentFiles[result.destination.index];
            updateFile({ id: srcFile.id, update: { ordering: target?.ordering ? target.ordering - 1 : null } });
        } else {
            // === Move one file into an existing folder ===
            if (!result.destination || result.destination.droppableId === '___current___') return;
            const folderName = result.destination.droppableId.replace(/^___folder_/, '');
            const destPath =
                folderName === '___back___'
                    ? srcFile.path.slice(0, srcFile.path.length - 1)
                    : [...srcFile.path, folderName];

            updateFile({ id: srcFile.id, update: { path: destPath } });
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
                    <IconButton onClick={() => setViewingFavorites(!viewingFavorites)} size="large">
                        {viewingFavorites ? <Favorite color="primary" /> : <FavoriteBorder />}
                    </IconButton>
                </Tooltip>
                <Tooltip
                    arrow
                    placement="bottom"
                    title={altKey ? 'Shuffle folder' : 'Play and loop folder (alt/option to shuffle)'}
                >
                    <IconButton onClick={playCurrent} size="large">
                        {altKey ? <Shuffle /> : <PlaylistPlay />}
                    </IconButton>
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
            {runningJobs.length > 0 && (
                <JobsContainer>
                    <Divider />
                    {runningJobs}
                </JobsContainer>
            )}
        </ExplorerContainer>
    );
};
