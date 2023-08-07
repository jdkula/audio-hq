/**
 * FileEntry/FileDetailsEditor.tsx
 * ==========================
 * Provides an editor for the track details of a given file.
 */

import { ClickAwayListener, TextField, Typography } from '@mui/material';
import React, { FC, KeyboardEvent, useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import * as API from 'common/lib/api/models';
import { useUpdateEntryMutation } from '~/lib/api/hooks';
import { WorkspaceIdContext } from '~/lib/utility/context';

const EditorContainer = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
`;

const TextFieldContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
`;
const SourceDisplayContainer = styled.div`
    display: block;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: elipsis;
    white-space: nowrap;
`;

const Spacer = styled.div<{ space?: string }>`
    margin: ${({ space }) => space || '0.5rem'};
`;

interface FileDetailsEditorProps {
    finishEditing: () => void;

    autoFocusTitle: boolean;
    file: API.Single;
}

const FileDetailsEditor: FC<FileDetailsEditorProps> = ({ finishEditing, autoFocusTitle, file }) => {
    const workspaceId = useContext(WorkspaceIdContext);
    const [editName, setEditName] = useState(file.name);
    const [editDescription, setEditDescription] = useState(file.description);

    const updateTrack = useUpdateEntryMutation(workspaceId);

    useEffect(() => {
        setEditName(file.name);
        setEditDescription(file.description);
    }, [file.name, file.description]);

    const saveEdits = () => {
        finishEditing();
        updateTrack.mutate({
            entry: file,
            update: {
                ...file,
                name: editName,
                description: editDescription,
            },
        });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.code === 'Enter') {
            e.preventDefault();
            saveEdits();
        } else if (e.nativeEvent.code === 'Escape') {
            e.preventDefault();
            finishEditing();
        }
    };
    return (
        <ClickAwayListener onClickAway={saveEdits}>
            <EditorContainer>
                <TextFieldContainer>
                    <TextField
                        id={file.id + '-title'}
                        fullWidth
                        autoFocus={autoFocusTitle}
                        variant="outlined"
                        label="Title"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Spacer />
                    <TextField
                        id={file.id + '-description'}
                        fullWidth
                        autoFocus={!autoFocusTitle}
                        size="small"
                        variant="outlined"
                        label="Description"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {file.source && (
                        <SourceDisplayContainer>
                            <a href={file.source} target="_blank" rel="noreferrer noopener">
                                <Typography variant="body2" color="GrayText">
                                    Source: {new URL(file.source).hostname}
                                </Typography>
                            </a>
                        </SourceDisplayContainer>
                    )}
                </TextFieldContainer>
            </EditorContainer>
        </ClickAwayListener>
    );
};

export default FileDetailsEditor;
