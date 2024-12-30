/**
 * FileEntry/index.tsx
 * ==========================
 * Provides a user-interactible interface for a given File.
 * Allows the user to play a song as main/ambience, edit
 * file details, download or delete the file, as well as
 * display file information.
 */

import React, { FC, useState } from 'react';
import styled from '@emotion/styled';

import FileDeleteDialog from './FileDeleteDialog';
import PlayControls from './PlayControls';
import FileDetails from './FileDetails';
import StatusControls from './StatusControls';
import * as API from '@audio-hq/common/lib/api/models';
import { useIsOnline } from '~/lib/utility/hooks';

export const FileContainer = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto;
    grid-template-areas: 'playcontrols details filecontrols';

    align-content: center;
    align-items: center;

    ${({ theme }) => theme.breakpoints.down('sm')} {
        // grid-template-columns: 1fr 1fr;
        // grid-template-rows: auto auto;
        // grid-template-areas:
        //     'playcontrols filecontrols'
        //     'details      details';
        // padding: 1rem 2rem;
    }
`;

const FileEntry: FC<{ file: API.Single }> = ({ file }) => {
    const online = useIsOnline();
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
            <FileContainer>
                <PlayControls file={file} />

                <FileDetails
                    file={file}
                    autoFocusTitle={autoFocusTitle}
                    editing={online !== false && editing}
                    startEditing={startEditing}
                    finishEditing={cancelEdits}
                />

                <StatusControls
                    file={file}
                    editing={online !== false && editing}
                    setEditing={(editing) => (editing ? startEditing() : cancelEdits())}
                    setDelete={(deleting) => setDelete(deleting)}
                />
            </FileContainer>
        </>
    );
};

export default FileEntry;
