import React, { FC } from 'react';
import useFileManager, { FileManagerContext } from '~/lib/useFileManager';
import useMediaSession from '~/lib/useMediaSession';
import useWorkspace, { WorkspaceContext } from '~/lib/useWorkspace';
import LoadingPage from './LoadingPage';

const Root: FC<{
    workspace: string;
}> = (props) => {
    const { workspace, resolve, loading } = useWorkspace(props.workspace);
    const fileManager = useFileManager(props.workspace);

    useMediaSession(workspace, resolve);

    if (!workspace?.state || loading) {
        return <LoadingPage workspace={props.workspace} />;
    }

    return (
        <WorkspaceContext.Provider value={{ ...workspace, resolver: resolve }}>
            <FileManagerContext.Provider value={fileManager}>{props.children}</FileManagerContext.Provider>
        </WorkspaceContext.Provider>
    );
};
export default Root;
