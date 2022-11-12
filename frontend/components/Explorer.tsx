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

import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import FileEntry from './FileEntry';
import FolderAddDialog from './AddFolderDialog';
import FolderEntry from './FolderEntry';
import JobEntry from './JobEntry';
import SearchBar from './SearchBar';
import { Favorite, FavoriteBorder, PlaylistPlay, Shuffle } from '@mui/icons-material';
import { useLocalReactiveValue } from '../lib/LocalReactive';
import _ from 'lodash';
import { FileManagerContext, WorkspaceIdContext, WorkspaceLRVContext } from '~/lib/utility/context';
import { useAlt, useIsOnline } from '~/lib/utility/hooks';
import { useFavorites } from '~/lib/utility/usePersistentData';
import { isDefined } from '~/lib/utility/util';
import * as API from '~/lib/api/models';
import { usePlayDeckMutation, useUpdateTrackMutation, useWorkspaceDecks, useWorkspaceTracks } from '~/lib/api/hooks';

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
const getFiles = (files: API.Track[], path: string[], searchText?: string): API.Track[] => {
    const re = new RegExp(`.*${searchText}.*`, 'i');
    if (searchText !== undefined) return files.filter((file) => !!file.name.match(re) || !!file.description?.match(re));
    return files.filter((file) => file.path.length === path.length && path.every((v, i) => file.path[i] === v)) ?? [];
};

/**
 * Given a search string, finds all folders that contain tracks matching that search string.
 * Folders are returned as full paths ending at that folder.
 */
const getSearchFolders = (files: API.Track[], searchText: string): string[][] => {
    return _.uniqBy(
        files
            .map((file) => file.path)
            .filter((path) => path.length > 0)
            .filter((path) => path[path.length - 1].match(new RegExp(`.*${searchText}.*`, 'i')))
            .sort(),
        (path) => path[path.length - 1],
    );
};

/**
 * Given a path, finds all child folders.
 */
const getFolders = (files: API.Track[], currentPath: string[]): string[] => {
    return _.uniq(
        files
            .filter((file) => file.path.length > currentPath.length && currentPath.every((v, i) => file.path[i] === v))
            .map((file) => file.path[currentPath.length])
            .sort(),
    );
};

export const Explorer: FC = () => {
    const online = useIsOnline();
    const workspaceId = useContext(WorkspaceIdContext);

    const { currentPath: currentPathLRV } = useContext(WorkspaceLRVContext);

    const { main } = useWorkspaceDecks(workspaceId);

    const favs = useFavorites();
    const [viewingFavorites, setViewingFavorites] = useState(false);
    const [path, setPath] = useLocalReactiveValue(currentPathLRV);
    const [combining, setCombining] = useState<API.Track[]>([]);

    const [searching, setSearching] = useState(false);
    const [searchText, setSearchText] = useState('');

    const altKey = useAlt();

    const fileManager = useContext(FileManagerContext);

    const { data: filesRaw } = useWorkspaceTracks(workspaceId);
    const files = filesRaw ?? [];

    const playDeck = usePlayDeckMutation(workspaceId);
    const updateTrack = useUpdateTrackMutation(workspaceId);

    const currentFiles = React.useMemo(
        () =>
            (viewingFavorites
                ? favs.favorites.map((id) => files.find((file) => file.id === id)).filter<API.Track>(isDefined)
                : getFiles(files, path, searching && searchText.length > 1 ? searchText : undefined)
            ).filter((file) => online || fileManager.cached.has(file.url)),
        [online, viewingFavorites, favs, files, path, searching, searchText, fileManager.cached],
    );

    const availableFiles = React.useMemo(
        () => files.filter((file) => online || fileManager.cached.has(file.url)),
        [files, online, fileManager.cached],
    );

    const fileButtons = currentFiles.map((file, i) => <FileEntry file={file} index={i} key={file.id} />);

    const playCurrent = () => {
        let queue = [...currentFiles];
        if (altKey) {
            queue = _.shuffle(queue);
        }
        playDeck.mutate({
            deck: {
                speed: 1,
                volume: main?.volume ?? 1,
                startTimestamp: new Date(),
                pauseTimestamp: null,
                type: 'main',
                queue: queue,
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
        : searching && searchText.length > 1
        ? getSearchFolders(files, searchText).map((path, i) => (
              <FolderEntry
                  name={path[path.length - 1]}
                  path={path.slice(0, path.length - 1)}
                  key={i}
                  onClick={() => finishSearch(path)}
              />
          ))
        : getFolders(availableFiles, path).map((foldername) => (
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
            updateTrack.mutate({
                trackId: srcFile.id,
                update: {
                    ordering: target?.ordering
                        ? target.ordering - result.source.index + result.destination.index
                        : null,
                },
            });
        } else {
            // === Move one file into an existing folder ===
            if (!result.destination || result.destination.droppableId === '___current___') return;
            const folderName = result.destination.droppableId.replace(/^___folder_/, '');
            const destPath =
                folderName === '___back___'
                    ? srcFile.path.slice(0, srcFile.path.length - 1)
                    : [...srcFile.path, folderName];

            updateTrack.mutate({ trackId: srcFile.id, update: { path: destPath } });
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
