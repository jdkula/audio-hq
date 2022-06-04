/**
 * Root.tsx
 * =========
 * The top of the Workspace tree. Sets up all
 * the required Contexts, and is responsible for the
 * "audio blocked" notification.
 */

import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { FC, useContext } from 'react';
import useMediaSession from '../lib/audio/useMediaSession';
import LoadingPage from './LoadingPage';
import useAudioManager from '../lib/audio/useAudioManager';
import { useWorkspaceDetailQuery } from '../lib/generated/graphql';
import WorkspaceNotFound from './WorkspaceNotFound';
import {
    FileManagerProvider,
    WorkspaceIdContext,
    WorkspaceLocalReactiveValuesProvider,
    WorkspaceNameContext,
} from '~/lib/utility/context';

const MediaRoot: FC<{ children?: React.ReactNode }> = (props) => {
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
    const [{ data: workspaceRaw, fetching }] = useWorkspaceDetailQuery({
        requestPolicy: 'cache-first',
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
                <WorkspaceLocalReactiveValuesProvider workspaceId={workspaceId}>
                    <FileManagerProvider workspaceId={workspaceId}>
                        <MediaRoot>{props.children}</MediaRoot>
                    </FileManagerProvider>
                </WorkspaceLocalReactiveValuesProvider>
            </WorkspaceNameContext.Provider>
        </WorkspaceIdContext.Provider>
    );
};
export default Root;
