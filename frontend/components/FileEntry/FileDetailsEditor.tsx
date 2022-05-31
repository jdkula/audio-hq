/**
 * FileEntry/FileDetailsEditor.tsx
 * ==========================
 * Provides an editor for the track details of a given file.
 */

import { ClickAwayListener, TextField, Button, Box } from '@mui/material';
import React, { FC, KeyboardEvent, useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import useFileManager from '../../lib/useFileManager';
import { WorkspaceIdContext } from '../../lib/utility';
import { File_Minimum } from '../../lib/graphql_type_helper';
import { useUpdateFileMutation } from '../../lib/generated/graphql';

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

const ControlsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Spacer = styled.div<{ space?: string }>`
    margin: ${({ space }) => space || '0.5rem'};
`;

interface FileDetailsEditorProps {
    finishEditing: () => void;

    autoFocusTitle: boolean;
    file: File_Minimum;
}

const FileDetailsEditor: FC<FileDetailsEditorProps> = ({ finishEditing, autoFocusTitle, file }) => {
    const workspaceId = useContext(WorkspaceIdContext);

    const [editName, setEditName] = useState(file.name);
    const [editDescription, setEditDescription] = useState(file.description);

    const [, updateFile] = useUpdateFileMutation();

    useEffect(() => {
        setEditName(file.name);
        setEditDescription(file.description);
    }, [file.name, file.description]);

    const saveEdits = () => {
        finishEditing();
        updateFile({
            id: file.id,
            update: {
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
        <ClickAwayListener onClickAway={finishEditing}>
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
                </TextFieldContainer>
                <Box mx="4px" />
                <ControlsContainer>
                    <Button fullWidth onClick={saveEdits} variant="outlined" color="primary">
                        Save
                    </Button>
                    <Spacer space="0.25rem" />
                    <Button fullWidth onClick={finishEditing} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                </ControlsContainer>
            </EditorContainer>
        </ClickAwayListener>
    );
};

export default FileDetailsEditor;
