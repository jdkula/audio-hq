/**
 * FileEntry/FileDetails.tsx
 * ==========================
 * Provides a viewer track details inside a FileEntry
 * that can be double-clicked to reveal an editor.
 */

import { Typography } from '@mui/material';
import React, { FC } from 'react';
import styled from '@emotion/styled';
import FileDetailsEditor from './FileDetailsEditor';
import { File_Minimum } from '../../lib/graphql_type_helper';
import { toTimestamp } from '../../lib/utility';

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

const TimestampContainer = styled(Typography, {
    shouldForwardProp: (propName) => !(propName as string).startsWith('$'),
})<{ $editing?: boolean }>`
    padding-left: 1rem;
    text-align: right;
    ${({ $editing }) => ($editing ? '' : 'flex-grow: 1;')}
`;

interface FileDetailsProps {
    editing: boolean;
    startEditing: (withTitle: boolean) => void;
    finishEditing: () => void;

    autoFocusTitle: boolean;
    file: File_Minimum;
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
