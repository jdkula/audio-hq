import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React, { FC } from 'react';
import useAudioManager from '~/lib/useAudioManager';
import useFileManager, { FileManagerContext } from '~/lib/useFileManager';
import useMediaSession from '~/lib/useMediaSession';
import useWorkspace, { WorkspaceContext } from '~/lib/useWorkspace';
import LoadingPage from './LoadingPage';

const Subroot: FC = (props) => {
    useMediaSession();
    const { blocked } = useAudioManager();

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
    workspace: string;
}> = (props) => {
    const { workspace, resolve, loading, getCurrentTrackFrom } = useWorkspace(props.workspace);
    const fileManager = useFileManager(props.workspace);

    if (!workspace?.state || loading) {
        return <LoadingPage workspace={props.workspace} />;
    }

    return (
        <WorkspaceContext.Provider value={{ ...workspace, resolver: resolve, getCurrentTrackFrom }}>
            <FileManagerContext.Provider value={fileManager}>
                <Subroot>{props.children}</Subroot>
            </FileManagerContext.Provider>
        </WorkspaceContext.Provider>
    );
};
export default Root;
