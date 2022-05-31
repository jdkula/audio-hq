import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { FC, useContext, useEffect } from 'react';
import useMediaSession from '../lib/audio/useMediaSession';
import LoadingPage from './LoadingPage';
import useAudioManager from '../lib/audio/useAudioManager';
import { WorkspaceIdContext, WorkspaceNameContext } from '../lib/utility';
import { useCreateWorkspaceMutation, useWorkspaceDetailByNameQuery } from '../lib/generated/graphql';

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
    const [{ data: workspaceRaw, ...query }, refetch] = useWorkspaceDetailByNameQuery({
        variables: { workspaceName: props.workspace ?? '' },
        pause: !props.workspace,
    });
    const [, createWorkspace] = useCreateWorkspaceMutation();
    const workspaceId = workspaceRaw?.workspace?.[0]?.id;
    const workspaceName = workspaceRaw?.workspace?.[0]?.name;

    useEffect(() => {
        if (!workspaceRaw && props.workspace && !query.stale && !query.fetching && !query.error) {
            createWorkspace({ name: props.workspace }).then(() => refetch());
        }
    }, [createWorkspace, refetch, workspaceRaw, query, props.workspace]);

    if (!props.workspace || !workspaceName || !workspaceId) {
        return <LoadingPage workspace={workspaceName ?? props.workspace ?? '...'} />;
    }

    return (
        <WorkspaceIdContext.Provider value={workspaceId}>
            <WorkspaceNameContext.Provider value={workspaceName}>
                <Subroot>{props.children}</Subroot>
            </WorkspaceNameContext.Provider>
        </WorkspaceIdContext.Provider>
    );
};
export default Root;
