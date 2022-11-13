/**
 * Explorer.tsx
 * ==============================
 * One of Audio HQ's main panels. Provides
 * file/folder operations with all the saved tracks,
 * as well as is the interface by which users may play music.
 */

import { Breadcrumbs, Button, Divider, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import React, { FC, useContext, useMemo, useState } from 'react';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import FolderAddDialog from './AddFolderDialog';
import FolderEntry from './EntryItem/FolderEntry';
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
import { usePlayDeckMutation, useUpdateEntryMutation, useWorkspaceDecks, useWorkspaceEntries } from '~/lib/api/hooks';
import { entryIsFolder, entryIsSingle } from '~/lib/api/AudioHQApi';
import EntryItem, { DraggableEntryItem, DroppableEntryItem } from './EntryItem';

const ExplorerContainer = styled.div`
    grid-area: explorer;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const GoUpContainer = styled.div<{ enabled?: boolean; over?: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;

    user-select: none;

    pointer-events: ${({ enabled }) => (enabled ? 'all' : 'none')};
    opacity: ${({ enabled }) => (enabled ? 1 : 0)};
    background-color: ${({ theme, over }) => (over ? theme.palette.primary.main : theme.palette.grey.A700)};

    transition: opacity 0.25s, background-color 0.25s;

    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`;

const ExplorerToolbar = styled(Paper)`
    display: flex;
    align-items: center;
    padding: 0.5rem;
    margin-bottom: 1px;
    position: relative;
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

const JobsContainer = styled.div`
    height: 250px;
    overflow: auto;
`;

function isSingle(entry: API.Entry): entry is API.Single {
    return 'description' in entry;
}

/** Retrieves all WSFiles given a current path and an optional search string. */
const getEntries = (files: API.Entry[], path: string[], searchText?: string): API.Entry[] => {
    const caseInsensitiveSearchText = searchText?.toLowerCase();
    if (caseInsensitiveSearchText !== undefined) {
        return files.filter(
            (file) =>
                !!file.name.toLowerCase().includes(caseInsensitiveSearchText) ||
                (isSingle(file) && !!file.description.toLowerCase().includes(caseInsensitiveSearchText)),
        );
    }
    return files.filter((file) => file.path.length === path.length && path.every((v, i) => file.path[i] === v)) ?? [];
};

export const Explorer: FC = () => {
    const online = useIsOnline();
    const workspaceId = useContext(WorkspaceIdContext);

    const { currentPath: currentPathLRV } = useContext(WorkspaceLRVContext);

    const { main } = useWorkspaceDecks(workspaceId);

    const favs = useFavorites();
    const [viewingFavorites, setViewingFavorites] = useState(false);
    const [path, setPath] = useLocalReactiveValue(currentPathLRV);
    const [combining, setCombining] = useState<API.Entry[]>([]);
    const [isDragging, setDragging] = useState<false | 'folder' | 'file'>(false);

    const [searching, setSearching] = useState(false);
    const [searchText, setSearchText] = useState('');

    const altKey = useAlt();

    const fileManager = useContext(FileManagerContext);

    const { data: entriesRaw } = useWorkspaceEntries(workspaceId);
    const entries = React.useMemo(
        () =>
            (entriesRaw ?? []).sort(
                (a, b) => (a.ordering ?? Number.POSITIVE_INFINITY) - (b.ordering ?? Number.POSITIVE_INFINITY),
            ),
        [entriesRaw],
    );

    const playDeck = usePlayDeckMutation(workspaceId);
    const updateEntry = useUpdateEntryMutation(workspaceId);

    const separateFolders = false;

    const currentFiles = React.useMemo(() => {
        let arr: API.Entry[] = [];

        if (viewingFavorites) {
            arr = favs.favorites.map((id) => entries.find((file) => file.id === id)).filter<API.Entry>(isDefined);
        } else {
            arr = getEntries(entries, path, searching && searchText.length > 1 ? searchText : undefined);
        }

        return arr.filter((file) => online || (isSingle(file) && fileManager.cached.has(file.url)));
    }, [online, viewingFavorites, favs, entries, path, searching, searchText, fileManager.cached]);

    const items = useMemo(
        () =>
            currentFiles
                .filter((entry) => !separateFolders || !entryIsFolder(entry))
                .map((file, i) => (
                    <DraggableEntryItem
                        entry={file}
                        key={file.id}
                        currentPath={path}
                        index={i}
                        onNavigate={(folder) => {
                            setPath((path) => [...path, folder.name]);
                        }}
                    />
                )),
        [currentFiles, separateFolders, path, setPath],
    );

    const plainSinglesData = useMemo(() => {
        if (!separateFolders) return [];
        return currentFiles.filter((e) => !entryIsFolder(e));
    }, [currentFiles, separateFolders]);
    const plainSinglesView = useMemo(
        () =>
            plainSinglesData.map((entry) => (
                <EntryItem
                    entry={entry}
                    key={entry.id}
                    currentPath={path}
                    onNavigate={(folder) => {
                        setPath((path) => [...path, folder.name]);
                    }}
                />
            )),
        [plainSinglesData, path, setPath],
    );

    const foldersData = useMemo(() => {
        if (!separateFolders) return [];
        return currentFiles.filter(entryIsFolder);
    }, [currentFiles, separateFolders]);

    const draggableFolders = useMemo(() => {
        foldersData.map((folder, i) => (
            <DraggableEntryItem
                entry={folder}
                key={folder.id}
                currentPath={path}
                index={i}
                onNavigate={(folder) => {
                    setPath((path) => [...path, folder.name]);
                }}
            />
        ));
    }, [foldersData, path, setPath]);

    const droppableFolders = useMemo(() => {
        foldersData.map((folder) => (
            <DroppableEntryItem
                entry={folder}
                key={folder.id}
                currentPath={path}
                onNavigate={(folder) => {
                    setPath((path) => [...path, folder.name]);
                }}
            />
        ));
    }, [foldersData, path, setPath]);

    const playCurrent = () => {
        let queue = [...currentFiles].filter(entryIsSingle);
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
        setDragging(false);

        // The current list of files has a droppableId of ___current___
        // The "up" droppable has a droppableId of ___up___
        // Folder draggables have IDs that start with $FOLDER:
        // Folder droppables also have IDs that start with $FOLDER:
        // Single draggables have IDs that start with $SINGLE:

        const srcFile = entries.find((file) => file.id === result.draggableId.replace(/^\$.*?:/, ''));
        const dstFolder = entries.find(
            (file) =>
                file.id === result.combine?.draggableId.replace(/^\$FOLDER:/, '') ||
                file.id === result.destination?.droppableId.replace(/^\$FOLDER:/, ''),
        );

        console.log('Drop', { result, srcFile, dstFolder });

        if (!srcFile) throw new Error("You dragged something that wasn't an entry, somehow??");

        // Dragging into a folder.
        if (dstFolder) {
            // === Move one file or folder into an existing folder ===
            if (!entryIsFolder(dstFolder)) throw new Error('Somehow, a non-folder had a folder tag.');
            const destPath = [...dstFolder.path, dstFolder.name];

            updateEntry.mutate({ entry: srcFile, update: { path: destPath } });
        } else if (result.destination?.droppableId === '___up___') {
            // === Move one file or folder up a level ===
            updateEntry.mutate({
                entry: srcFile,
                update: {
                    path: path.slice(0, -1),
                },
            });
        } else if (result.destination?.index !== undefined) {
            // === Reorder one file around the current folder ===

            let target: API.Entry | null = null;
            if (separateFolders && result.destination.droppableId === '___folders___' && srcFile.type === 'folder') {
                target = foldersData[result.destination.index];
            } else if (
                separateFolders &&
                result.destination.droppableId === '___main___' &&
                srcFile.type !== 'folder'
            ) {
                target = plainSinglesData[result.destination.index];
            } else {
                target = currentFiles[result.destination.index];
            }

            updateEntry.mutate({
                entry: srcFile,
                update: {
                    ordering: target?.ordering
                        ? target.ordering - result.source.index + result.destination.index
                        : null,
                },
            });
        }
    };

    const toolbarContents = (
        <>
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
        </>
    );

    return (
        <ExplorerContainer>
            <DragDropContext
                onDragEnd={handleDrag}
                onBeforeCapture={(init) => {
                    console.log('INITTING CAPTURE:', init.draggableId, init.draggableId.startsWith('$FOLDER:'));
                    setDragging(init.draggableId.startsWith('$FOLDER:') ? 'folder' : 'file');
                }}
            >
                <ExplorerToolbar square variant="elevation" color="primary">
                    {toolbarContents}
                    <Droppable droppableId="___up___">
                        {(provided, snapshot) => (
                            <GoUpContainer
                                enabled={path.length > 0 && !!isDragging}
                                over={snapshot.isDraggingOver}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                <Typography variant="button">Drag here to place outside of folder</Typography>
                                <div style={{ display: 'none' }}>{provided.placeholder}</div>
                            </GoUpContainer>
                        )}
                    </Droppable>
                </ExplorerToolbar>
                <FolderAddDialog files={combining} cancel={() => setCombining([])} />

                <FileListContainer>
                    <FileListScrollContainer>
                        {separateFolders && !viewingFavorites && (
                            <>
                                {isDragging === 'file' ? (
                                    droppableFolders
                                ) : (
                                    <Droppable isCombineEnabled droppableId="___folders___">
                                        {(provided) => (
                                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                                {draggableFolders}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                )}
                                <Divider />
                            </>
                        )}

                        {separateFolders && isDragging === 'folder' ? (
                            plainSinglesView
                        ) : (
                            <Droppable isDropDisabled={viewingFavorites} isCombineEnabled droppableId="___main___">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {items}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        )}
                    </FileListScrollContainer>
                </FileListContainer>
                {runningJobs.length > 0 && (
                    <JobsContainer>
                        <Divider />
                        {runningJobs}
                    </JobsContainer>
                )}
            </DragDropContext>
        </ExplorerContainer>
    );
};
