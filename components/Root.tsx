import React, { FC } from 'react';
import styled from 'styled-components';
import useFileManager, { FileManagerContext } from '~/lib/useFileManager';
import useMediaSession from '~/lib/useMediaSession';
import useWorkspace, { WorkspaceContext } from '~/lib/useWorkspace';
import LoadingPage from './LoadingPage';

const Container = styled.div`
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto 1fr min-content;
    grid-template-areas:
        'header'
        'tabcontent'
        'other';

    align-items: center;
    justify-content: stretch;
    justify-items: center;
    align-content: stretch;

    min-width: 100vw;
    min-height: 100vh;

    & > div {
        overflow: hidden;
    }
`;

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
            <FileManagerContext.Provider value={fileManager}>
                <Container>{props.children}</Container>
            </FileManagerContext.Provider>
        </WorkspaceContext.Provider>
    );
};
export default Root;
