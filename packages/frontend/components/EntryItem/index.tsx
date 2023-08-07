import styled from '@emotion/styled';
import { Paper } from '@mui/material';
import { Draggable, DraggableStateSnapshot, Droppable, DroppableStateSnapshot } from '@hello-pangea/dnd';
import { entryIsSingle } from 'clients/lib/AudioHQApi';
import { Entry, Folder } from 'common/lib/api/models';
import FileEntry from './FileEntry';
import FolderEntry from './FolderEntry';

const EntryContainerInner = styled(Paper)`
    display: flex;
    justify-content: stretch;
    align-items: center;
    min-height: 3rem;
    width: auto;

    border-radius: 3rem;
    overflow: hidden;
    padding: 0.25rem 0.25rem;
    transition: background-color 0.25s;

    &:hover {
        background-color: ${({ theme }) => (theme.palette.mode === 'dark' ? '#333' : '#eee')};
    }

    ${({ theme }) => theme.breakpoints.down('sm')} {
        padding: 1rem 2rem;
    }
`;

const EntryContainerOuter = styled.div`
    padding: 0.5rem 1rem;
`;

interface EntryProps {
    entry: Entry;
    currentPath: string[];
    onNavigate: (folder: Folder) => void;
    dragSnapshot?: DraggableStateSnapshot;
    dropSnapshot?: DroppableStateSnapshot;
}

export default function EntryItem({ entry, onNavigate, currentPath, dragSnapshot, dropSnapshot }: EntryProps) {
    if (entryIsSingle(entry)) {
        return (
            <EntryContainerOuter>
                <EntryContainerInner>
                    <FileEntry file={entry} />
                </EntryContainerInner>
            </EntryContainerOuter>
        );
    } else {
        return (
            <EntryContainerOuter>
                <EntryContainerInner>
                    <FolderEntry
                        folder={entry}
                        onClick={() => onNavigate(entry)}
                        path={currentPath}
                        dragging={!!(dragSnapshot?.combineTargetFor || dropSnapshot?.isDraggingOver)}
                    />
                </EntryContainerInner>
            </EntryContainerOuter>
        );
    }
}

export function DraggableEntryItem({ index, ...props }: EntryProps & { index: number }) {
    const prefix = props.entry.type === 'folder' ? '$FOLDER:' : '$SINGLE:';
    return (
        <Draggable draggableId={prefix + props.entry.id} index={index}>
            {(provided, snapshot) => (
                <div
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                    data-draggableid={prefix + props.entry.id}
                >
                    <EntryItem {...props} dragSnapshot={snapshot} />
                </div>
            )}
        </Draggable>
    );
}

export function DroppableEntryItem({ ...props }: EntryProps) {
    const prefix = props.entry.type === 'folder' ? '$FOLDER:' : '$SINGLE';
    return (
        <Droppable droppableId={prefix + props.entry.id} isCombineEnabled>
            {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    <EntryItem {...props} dropSnapshot={snapshot} />
                    <div style={{ display: 'none' }}>{provided.placeholder}</div>
                </div>
            )}
        </Droppable>
    );
}
