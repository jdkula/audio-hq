import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { FC, useContext } from 'react';
import useMediaSession from '../lib/audio/useMediaSession';
import LoadingPage from './LoadingPage';
import useAudioManager from '../lib/audio/useAudioManager';
import { WorkspaceIdContext, WorkspaceNameContext } from '../lib/utility';
import { useWorkspaceDetailQuery } from '../lib/generated/graphql';
import WorkspaceNotFound from './WorkspaceNotFound';
import useFileManager, { FileManagerContext } from '~/lib/useFileManager';

const BlockedRoot: FC<{ children?: React.ReactNode }> = (props) => {
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

const FileManagerRoot: FC<{ children?: React.ReactNode }> = (props) => {
    const workspaceId = useContext(WorkspaceIdContext);
    const fileManager = useFileManager(workspaceId);

    return <FileManagerContext.Provider value={fileManager}>{props.children}</FileManagerContext.Provider>;
};

const Root: FC<{
    workspace?: string | null;
    children?: React.ReactNode;
}> = (props) => {
    const [{ data: workspaceRaw, fetching }] = useWorkspaceDetailQuery({
        variables: { workspaceId: props.workspace ?? '' },
        pause: !props.workspace,
    });
    const workspaceId = workspaceRaw?.workspace_by_pk?.id;
    const workspaceName = workspaceRaw?.workspace_by_pk?.name;

    if (!fetching && props.workspace && !workspaceName) {
        return <WorkspaceNotFound />;
    }

    if (!props.workspace || !workspaceName || !workspaceId) {
        return <LoadingPage workspace={workspaceName ?? props.workspace ?? '...'} />;
    }

    return (
        <WorkspaceIdContext.Provider value={workspaceId}>
            <WorkspaceNameContext.Provider value={workspaceName}>
                <FileManagerRoot>
                    <BlockedRoot>{props.children}</BlockedRoot>
                </FileManagerRoot>
            </WorkspaceNameContext.Provider>
        </WorkspaceIdContext.Provider>
    );
};
export default Root;
