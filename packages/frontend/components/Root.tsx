/**
 * Root.tsx
 * =========
 * The top of the Workspace tree. Sets up all
 * the required Contexts, and is responsible for the
 * "audio blocked" notification.
 */

import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { FC, useContext, useEffect } from 'react';
import useMediaSession from '../lib/audio/useMediaSession';
import LoadingPage from './LoadingPage';
import useAudioManager from '../lib/audio/useAudioManager';
import WorkspaceNotFound from './WorkspaceNotFound';
import {
    FileManagerProvider,
    WorkspaceIdContext,
    WorkspaceLocalReactiveValuesProvider,
    WorkspaceNameContext,
} from '~/lib/utility/context';
import { useWorkspaceDetail } from '~/lib/api/hooks';
import { useRouter } from 'next/router';

const MediaRoot: FC<{ children?: React.ReactNode }> = (props) => {
    const workspaceId = useContext(WorkspaceIdContext);
    useMediaSession(workspaceId);
    const router = useRouter();
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

const WorkspaceRoot: FC<{
    workspace: string;
    children?: React.ReactNode;
}> = (props) => {
    const { data: workspace, isFetching: fetching } = useWorkspaceDetail(props.workspace);
    const workspaceId = workspace?.id;
    const workspaceName = workspace?.name;

    if (!fetching && props.workspace && !workspaceName) {
        return <WorkspaceNotFound />;
    }

    if (!workspaceName || !workspaceId) {
        return <LoadingPage workspace={workspaceName ?? workspaceId ?? '...'} />;
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

const Root: FC<{
    workspace?: string | null;
    children?: React.ReactNode;
}> = (props) => {
    if (!props.workspace) {
        return <LoadingPage workspace={'...'} />;
    }

    return <WorkspaceRoot workspace={props.workspace}>{props.children}</WorkspaceRoot>;
};
export default Root;
