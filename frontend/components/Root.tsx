import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { FC, useContext } from 'react';
import useMediaSession from '../lib/audio/useMediaSession';
import LoadingPage from './LoadingPage';
import useAudioManager from '../lib/audio/useAudioManager';
import { WorkspaceIdContext } from '../lib/utility';

const Subroot: FC<{ children?: React.ReactNode }> = (props) => {
    const workspaceId = useContext(WorkspaceIdContext);
    useMediaSession(workspaceId);
    const { blocked } = useAudioManager(workspaceId);

    return (
        <>
            <Dialog open={blocked}>
                <DialogTitle>Audio Blocked</DialogTitle>
                <DialogContent dividers>Please tap or click anywhere to resume.</DialogContent>
            </Dialog>
            {props.children}
        </>
    );
};

const Root: FC<{
    workspace?: string | null;
    children?: React.ReactNode;
}> = (props) => {
    if (!props.workspace) {
        return <LoadingPage workspace={props.workspace ?? '...'} />;
    }

    return (
        <WorkspaceIdContext.Provider value={props.workspace}>
            <Subroot>{props.children}</Subroot>
        </WorkspaceIdContext.Provider>
    );
};
export default Root;
