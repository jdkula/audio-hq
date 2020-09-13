import { Box, ClickAwayListener, TextField, Divider, Button, Typography } from '@material-ui/core';
import React, { FC, KeyboardEvent, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import toTimestamp from '~/lib/toTimestamp';
import { FileManagerContext } from '~/lib/useFileManager';
import { File } from '~/lib/Workspace';

const DetailsContainer = styled.div`
    display: flex;
    align-items: center;
    grid-area: details;

    padding: 0.33rem 1rem;
`;

interface FileDetailsProps {
    editing: boolean;
    startEditing: (withTitle: boolean) => void;
    finishEditing: () => void;

    autoFocusTitle: boolean;
    file: File;
}

const FileDetails: FC<FileDetailsProps> = ({ editing, startEditing, finishEditing, file, autoFocusTitle }) => {
    const fileManager = useContext(FileManagerContext);

    const [editName, setEditName] = useState(file.name);
    const [editDescription, setEditDescription] = useState(file.description);

    useEffect(() => {
        if (!editing) {
            setEditName(file.name);
            setEditDescription(file.description);
        }
    });

    const saveEdits = () => {
        finishEditing();
        fileManager.update(file.id, {
            name: editName,
            description: editDescription,
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
        <DetailsContainer>
            <Box display="flex" alignItems="center" flexGrow={1}>
                {editing ? (
                    <ClickAwayListener onClickAway={finishEditing}>
                        <Box display="flex" alignItems="center" flexGrow={1}>
                            <Box display="flex" flexDirection="column" flexGrow={1}>
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
                                <Box m={0.5} />
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
                            </Box>
                            <Divider variant="middle" orientation="vertical" flexItem />
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Box mb={0.5} width="100%">
                                    <Button fullWidth onClick={saveEdits} variant="outlined" color="primary">
                                        Save
                                    </Button>
                                </Box>
                                <Button fullWidth onClick={finishEditing} variant="outlined">
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </ClickAwayListener>
                ) : (
                    <Box display="flex" flexDirection="column" style={{ cursor: 'text' }}>
                        <Typography variant="body1" component="span" onDoubleClick={() => startEditing(true)}>
                            {file.name || 'Untitled file...'}
                        </Typography>
                        {file.description && (
                            <Typography variant="caption" onDoubleClick={() => startEditing(false)}>
                                {file.description}
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
            <Box pl="1rem" textAlign="right" style={{ flexGrow: editing ? undefined : 1 }}>
                <Typography variant="body1">{toTimestamp(file.length)}</Typography>
            </Box>
        </DetailsContainer>
    );
};

export default FileDetails;
