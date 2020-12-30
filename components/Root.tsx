import React, { FC, useEffect, useState } from 'react';
import AudioContextContext from '~/lib/AudioContextContext';
import useAudioContext from '~/lib/useAudioContext';
import useFileManager, { FileManagerContext } from '~/lib/useFileManager';
import useWorkspace, { WorkspaceContext } from '~/lib/useWorkspace';
import LoadingPage from './LoadingPage';

const Root: FC<{
    workspace: string;
}> = (props) => {
    const { workspace, resolve, loading } = useWorkspace(props.workspace);
    const fileManager = useFileManager(props.workspace);

    const ctx = useAudioContext(workspace!, resolve);

    if (!workspace?.state || loading) {
        return <LoadingPage workspace={props.workspace} />;
    }

    return (
        <WorkspaceContext.Provider value={{ ...workspace, resolver: resolve }}>
            <FileManagerContext.Provider value={fileManager}>
                <AudioContextContext.Provider value={ctx}>{props.children}</AudioContextContext.Provider>
            </FileManagerContext.Provider>
        </WorkspaceContext.Provider>
    );
};
export default Root;
