import styled from '@emotion/styled';
import { Paper } from '@mui/material';
import { entryIsSingle } from 'clients/lib/AudioHQApi';
import { Entry, Folder } from 'common/lib/api/models';
import FileEntry from './FileEntry';
import FolderEntry from './FolderEntry';
import { useDrag, useDrop } from 'react-dnd';

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
    dragging: boolean;
    onNavigate: (folder: Folder) => void;
}

export default function EntryItem({ entry, onNavigate, currentPath, dragging }: EntryProps) {
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
                        dragging={dragging}
                    />
                </EntryContainerInner>
            </EntryContainerOuter>
        );
    }
}

export function DraggableEntryItem({ index, ...props }: EntryProps & { index: number }) {
    const [{ dragging }, drag] = useDrag({
        type: props.entry.type,
        item: {
            entry: props.entry,
            index,
        },
        collect: (monitor) => ({
            dragging: monitor.isDragging(),
        }),
    });
    return (
        <div ref={drag}>
            <EntryItem {...props} dragging={dragging} />
        </div>
    );
}

export function DroppableEntryItem({ ...props }: EntryProps) {
    const [{ dragging }, drop] = useDrop({
        accept: ['file', 'folder'],
        collect: (monitor) => ({
            dragging: monitor.canDrop(),
            isOver: monitor.isOver(),
        }),
    });
    return (
        <div ref={drop}>
            <EntryItem {...props} dragging={dragging} />
        </div>
    );
}
