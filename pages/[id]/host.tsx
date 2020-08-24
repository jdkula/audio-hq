import { useEffect, FunctionComponent, createContext } from 'react';
import { Header } from '~/components/host/Header';
import { NowPlaying } from '~/components/host/NowPlaying';
import { Explorer } from '~/components/host/Explorer';
import { Ambience } from '~/components/host/Ambience';
import { SoundFX } from '~/components/host/SoundFX';
import { CurrentUsers } from '~/components/host/CurrentUsers';
import { Workspace, WorkspaceResolver } from '~/lib/Workspace';
import { GetServerSideProps } from 'next';
import useWorkspace from '~/lib/useWorkspace';
import styled from 'styled-components';
import useFileManager, { FileManagerContext } from '~/lib/useFileManager';

export const WorkspaceContext = createContext<Workspace & { resolver: WorkspaceResolver }>(null as never);

const Container = styled.div`
    display: grid;
    grid-template-columns: 50% 30% 20%;
    grid-template-rows: 65px 40% auto 40%;
    grid-template-areas:
        'header     header   header  '
        'nowplaying explorer explorer'
        'ambience   explorer explorer'
        'ambience   sfx      users   ';
    min-height: 100vh;
`;

const Host: FunctionComponent<{
    workspace: string;
}> = (props) => {
    const { workspace, resolve } = useWorkspace(props.workspace);
    const fileManager = useFileManager();

    const setSong = async (id: string) => {
        resolve({ playing: { id, startTimestamp: Date.now() } });
    };

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.metadata = new MediaMetadata({ title: props.workspace });
        }
    }, [workspace]);

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.setActionHandler('pause', () => {
                // resolve({ playing: { volume: 0 } });
            });
            navigator.mediaSession.setActionHandler('stop', () => {
                // resolve({ playing: { volume: 0 } });
            });

            navigator.mediaSession.setActionHandler('play', () => {
                resolve({ playing: { pauseTime: null } });
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                resolve({ playing: { startTimestamp: Date.now(), pauseTime: null } });
            });
        }
    }, [resolve]);

    if (!workspace?.state) return null;

    return (
        <WorkspaceContext.Provider value={{ ...workspace, resolver: resolve }}>
            <FileManagerContext.Provider value={fileManager}>
                <Container>
                    <Header />
                    {workspace.state.playing && (
                        <NowPlaying
                            resolver={(update) => resolve({ playing: update })}
                            state={workspace.state.playing}
                        />
                    )}
                    <Explorer setSong={setSong} />
                    <Ambience />
                    <SoundFX />
                    <CurrentUsers />
                </Container>
            </FileManagerContext.Provider>
        </WorkspaceContext.Provider>
    );
};
export default Host;

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            workspace: context.query.id,
        },
    };
};
