import { FC, FunctionComponent, useContext, useEffect, useRef, useState } from 'react';
import { Header, VolumeButton } from '~/components/host/Header';
import { Explorer } from '~/components/host/Explorer';
import { Ambience } from '~/components/host/Ambience';
// import { SoundFX } from '~/components/host/SoundFX';
// import { CurrentUsers } from '~/components/host/CurrentUsers';
import { GetServerSideProps } from 'next';
import useWorkspace from '~/lib/useWorkspace';
import styled from 'styled-components';
import useFileManager, { FileManagerContext } from '~/lib/useFileManager';
import { useRecoilState } from 'recoil';
import { globalVolumeAtom, WorkspaceContext } from './host';
import { AudioControls } from '../../components/host/AudioControls';
import { Box, IconButton, LinearProgress, Popover, Slider, Tooltip } from '@material-ui/core';

const Container = styled.div`
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 65px auto;
    grid-template-areas:
        'header'
        'tabcontent';

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

const MajorVolumeControls: FC = () => {
    const [globalVolume, setGlobalVolume] = useRecoilState(globalVolumeAtom);

    return (
        <Box mx="1rem" my="0.25rem" minWidth="6rem">
            <Slider
                min={0}
                max={1}
                step={0.05}
                value={globalVolume}
                onChange={(_, val) => setGlobalVolume(val as number)}
            />
        </Box>
    );
};

const MainApp: FC = () => {
    const { state, resolver } = useContext(WorkspaceContext);
    const fileManager = useContext(FileManagerContext);
    const [blocked, setBlocked] = useState(false);

    const players = [...state.ambience, ...(state.playing ? [state.playing] : [])].map((ps) => (
        <AudioControls
            state={ps}
            key={ps.id}
            resolver={() => {
                /* do nothing */
            }}
            onBlocked={(b) => setBlocked(b)}
        />
    ));

    const fetchers = fileManager.fetching.map((job) =>
        job.progress === null ? (
            <LinearProgress key={job.jobId} />
        ) : (
            <LinearProgress variant="determinate" value={job.progress * 100} key={job.jobId} />
        ),
    );

    return (
        <>
            <Header />
            <MajorVolumeControls />
            <Box display="none">{players}</Box>
            {blocked && 'Please click anywhere on the screen to enable audio.'}
            {fetchers}
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
            navigator.mediaSession.setActionHandler('play', () => {
                if (globalVolume === 0) {
                    setGlobalVolume(previousVolumeValue.current ?? 1);
                }
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                // do nothing
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
