/**
 * FileEntry/FileDetails.tsx
 * ==========================
 * Provides a viewer track details inside a FileEntry
 * that can be double-clicked to reveal an editor.
 */

import { Typography } from '@material-ui/core';
import React, { FC } from 'react';
import styled from 'styled-components';
import toTimestamp from '~/lib/toTimestamp';
import { File } from '~/lib/Workspace';
import FileDetailsEditor from './FileDetailsEditor';

const DetailsContainer = styled.div`
    display: flex;
    align-items: center;
    grid-area: details;

    padding: 0.33rem 1rem;
`;

const EditorContainer = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
`;

const TextContainer = styled.div`
    display: flex;
    flex-direction: column;
    cursor: text;
`;

const TimestampContainer = styled(Typography)<{ $editing?: boolean }>`
    padding-left: 1rem;
    text-align: right;
    ${({ $editing }) => ($editing ? '' : 'flex-grow: 1;')}
`;

interface FileDetailsProps {
    editing: boolean;
    startEditing: (withTitle: boolean) => void;
    finishEditing: () => void;

    autoFocusTitle: boolean;
    file: File;
}

const FileDetails: FC<FileDetailsProps> = (props) => {
    const { editing, startEditing, file } = props;

    return (
        <DetailsContainer>
            <EditorContainer>
                {editing ? (
                    <FileDetailsEditor {...props} />
                ) : (
                    <TextContainer>
                        <Typography variant="body1" component="span" onDoubleClick={() => startEditing(true)}>
                            {file.name || 'Untitled file...'}
                        </Typography>
                        {file.description && (
                            <Typography variant="caption" onDoubleClick={() => startEditing(false)}>
                                {file.description}
                            </Typography>
                        )}
                    </TextContainer>
                )}
            </EditorContainer>
            <TimestampContainer $editing={editing} variant="body1">
                {toTimestamp(file.length)}
            </TimestampContainer>
        </DetailsContainer>
    );
};

export default FileDetails;
