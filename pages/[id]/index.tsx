import { createContext, FC, FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import { Header } from '~/components/host/Header';
import { NowPlaying } from '~/components/host/NowPlaying';
import { Explorer } from '~/components/host/Explorer';
import { Ambience } from '~/components/host/Ambience';
// import { SoundFX } from '~/components/host/SoundFX';
// import { CurrentUsers } from '~/components/host/CurrentUsers';
import { Workspace, WorkspaceResolver } from '~/lib/Workspace';
import { GetServerSideProps } from 'next';
import useWorkspace from '~/lib/useWorkspace';
import styled from 'styled-components';
import useFileManager, { FileManagerContext } from '~/lib/useFileManager';
import { atom, useRecoilState } from 'recoil';
import { AppBar, Box, Tab, Tabs, useMediaQuery, useTheme } from '@material-ui/core';

export const WorkspaceContext = createContext<Workspace & { resolver: WorkspaceResolver }>(null as never);

export const globalVolumeAtom = atom({
    key: 'globalVolume',
    default: 1,
});

const Container = styled.div`
    display: grid;
    grid-template-columns: 50% 30% 20%;
    grid-template-rows: 65px 40% auto 40%;
    grid-template-areas:
        'header     header   header  '
        'nowplaying explorer explorer'
        'ambience   explorer explorer'
        'ambience   explorer explorer';
    height: 100vh;

    ${({ theme }) => theme.breakpoints.down('sm')} {
        grid-template-columns: 100%;
        grid-template-rows: 65px 45px auto;
        grid-template-areas:
            'header'
            'tabs'
            'tabcontent';
    }

    & > div {
        overflow: hidden;
    }
`;

const TabContainer = styled.div`
    grid-area: tabcontent;
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: auto;
    & > * {
        grid-area: unset;
    }
`;

const MainApp: FC = () => {
    const { state, resolver } = useContext(WorkspaceContext);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const [tabValue, setTabValue] = useState(0);

    const nowPlaying = <NowPlaying resolver={(update) => resolver({ playing: update })} state={state.playing} />;

    if (isSmall) {
        return (
            <>
                <Header host />
                <AppBar position="static" color="default" style={{ gridArea: 'tabs' }}>
                    <Tabs variant="fullWidth" value={tabValue} onChange={(_, v) => setTabValue(v)}>
                        <Tab label="Main" />
                        <Tab label="Ambience" />
                        <Tab label="Explorer" />
                    </Tabs>
                </AppBar>
                <TabContainer>
                    <TabContainer style={{ display: tabValue === 0 ? undefined : 'none' }}>{nowPlaying}</TabContainer>
                    <TabContainer style={{ display: tabValue === 1 ? undefined : 'none' }}>
                        <Ambience />
                    </TabContainer>
                    <TabContainer style={{ display: tabValue === 2 ? undefined : 'none' }}>
                        <Explorer />
                    </TabContainer>
                </TabContainer>
            </>
        );
    }
    return (
        <>
            <Header host />
            {nowPlaying}
            <Explorer />
            <Ambience />
            {/* <SoundFX /> */}
            {/* <CurrentUsers /> */}
        </>
    );
};

const Host: FunctionComponent<{
    workspace: string;
}> = (props) => {
    const { workspace, resolve } = useWorkspace(props.workspace);
    const fileManager = useFileManager(props.workspace);
    const [globalVolume, setGlobalVolume] = useRecoilState(globalVolumeAtom);
    const previousVolumeValue = useRef<number | null>(null);

    const currentlyPlaying = workspace?.files.find((file) => file.id === workspace.state.playing?.id);

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentlyPlaying?.name ?? 'Nothing Playing',
                artist: `Audio HQ - ${props.workspace}`,
            });
        }
    }, [props.workspace, currentlyPlaying]);

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.setActionHandler('pause', () => {
                previousVolumeValue.current = globalVolume;
                setGlobalVolume(0);
            });
            navigator.mediaSession.setActionHandler('stop', () => {
                resolve({ playing: null });
            });

            navigator.mediaSession.setActionHandler('play', () => {
                if (globalVolume === 0) {
                    setGlobalVolume(previousVolumeValue.current ?? 1);
                }
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                resolve({ playing: { startTimestamp: Date.now(), pauseTime: null } });
            });
        }
    }, [resolve, globalVolume, setGlobalVolume]);

    if (!workspace?.state) return null;

    return (
        <WorkspaceContext.Provider value={{ ...workspace, resolver: resolve }}>
            <FileManagerContext.Provider value={fileManager}>
                <Container>
                    <MainApp />
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
