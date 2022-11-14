/**
 * FileEntry/FileDetails.tsx
 * ==========================
 * Provides a viewer track details inside a FileEntry
 * that can be double-clicked to reveal an editor.
 */

import { CircularProgress, Tooltip, Typography } from '@mui/material';
import React, { FC, useContext } from 'react';
import styled from '@emotion/styled';
import FileDetailsEditor from './FileDetailsEditor';
import { durationOfLength } from '~/lib/utility/util';
import * as API from '~/lib/api/models';
import { FileManagerContext } from '~/lib/utility/context';
import { DownloadDone } from '@mui/icons-material';

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

    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    column-gap: 1rem;
`;

interface FileDetailsProps {
    editing: boolean;
    startEditing: (withTitle: boolean) => void;
    finishEditing: () => void;

    autoFocusTitle: boolean;
    file: API.Single;
}

const FileDetails: FC<FileDetailsProps> = (props) => {
    const { editing, startEditing, file } = props;

    const fileManager = useContext(FileManagerContext);
    const cached = !!fileManager.cached.has(file.url);
    const caching = !!fileManager.caching.has(file.url);

    let cacheIcon: JSX.Element | null = null;
    if (caching) {
        cacheIcon = (
            <Tooltip placement="top" arrow title="Caching...">
                <CircularProgress variant="indeterminate" size="0.75rem" color="inherit" style={{ color: '#888' }} />
            </Tooltip>
        );
    } else if (cached) {
        cacheIcon = (
            <Tooltip placement="top" arrow title="This audio is cached.">
                <DownloadDone
                    fontSize="inherit"
                    color="inherit"
                    style={{ fontSize: '1rem', color: '#888', opacity: 0.5 }}
                />
            </Tooltip>
        );
    }

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
                {cacheIcon}
                {durationOfLength(file.length)}
            </TimestampContainer>
        </DetailsContainer>
    );
};

export default FileDetails;
