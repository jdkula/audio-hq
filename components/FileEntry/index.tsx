/**
 * FileEntry/index.tsx
 * ==========================
 * Provides a user-interactible interface for a given File.
 * Allows the user to play a song as main/ambience, edit
 * file details, download or delete the file, as well as
 * display file information.
 */

import { Paper } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { File as WSFile } from '~/lib/Workspace';
import styled from 'styled-components';

import FileDeleteDialog from './FileDeleteDialog';
import PlayControls from './PlayControls';
import FileDetails from './FileDetails';
import StatusControls from './StatusControls';

export const FileContainer = styled(Paper)`
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto;
    grid-template-areas: 'playcontrols details filecontrols';

    margin: 0.5rem 1rem;
    border-radius: 3rem;
    overflow: hidden;
    padding: 0.25rem 0.25rem;
    transition: background-color 0.25s;
    align-content: center;
    align-items: center;
    min-height: 50px;

    &:hover {
        background-color: #eee;
    }

    ${({ theme }) => theme.breakpoints.down('xs')} {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto;
        grid-template-areas:
            'playcontrols filecontrols'
            'details      details';
        padding: 1rem 2rem;
    }
`;

const FileEntry: FC<{ file: WSFile; index: number }> = ({ file, index }) => {
    const [showDelete, setDelete] = useState(false);

    const [editing, setEditing] = useState(false);
    const [autoFocusTitle, setAutoFocusTitle] = useState(true);

    const startEditing = (withTitle = true) => {
        setEditing(true);
        setAutoFocusTitle(withTitle);
    };

    const cancelEdits = () => {
        setEditing(false);
        setAutoFocusTitle(true);
    };

    return (
        <>
            <FileDeleteDialog open={showDelete} file={file} onClose={() => setDelete(false)} />
            <Draggable draggableId={file.id} index={index}>
                {(provided, snapshot) => (
                    <FileContainer {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                        <PlayControls snapshot={snapshot} file={file} />

                        <FileDetails
                            file={file}
                            autoFocusTitle={autoFocusTitle}
                            editing={editing}
                            startEditing={startEditing}
                            finishEditing={cancelEdits}
                        />

                        <StatusControls
                            file={file}
                            editing={editing}
                            setEditing={(editing) => (editing ? cancelEdits() : startEditing())}
                            setDelete={(deleting) => setDelete(deleting)}
                        />
                    </FileContainer>
                )}
            </Draggable>
        </>
    );
};

export default FileEntry;
