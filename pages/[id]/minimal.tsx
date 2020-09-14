import React, { FC, FunctionComponent, useContext, useState } from 'react';
import { Header } from '~/components/Header';
import { GetServerSideProps } from 'next';
import { WorkspaceContext } from '~/lib/useWorkspace';
import { FileManagerContext } from '~/lib/useFileManager';
import { useRecoilState } from 'recoil';
import { AudioControls } from '~/components/AudioControls';
import { Box, LinearProgress, Slider, Typography } from '@material-ui/core';
import { globalVolumeAtom } from '~/lib/atoms';
import VolumeButton from '~/components/VolumeButton';
import Root from '~/components/Root';
import styled from 'styled-components';

const VolumeControlOuter = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;

const VolumeControlInner = styled.div`
    margin: 0.25rem 1rem;
    padding: 2rem;

    min-width: 10rem;
    max-width: 50rem;

    width: 100%;

    display: flex;
    align-items: center;
`;

const MainContainer = styled.div`
    width: 100%;

    display: flex;
    align-items: center;
    flex-direction: column;

    grid-area: tabcontent;
    text-align: center;
`;

const Fetchers = styled.div`
    grid-area: other;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
`;

const MajorVolumeControls: FC = () => {
    const [globalVolume, setGlobalVolume] = useRecoilState(globalVolumeAtom);

    return (
        <VolumeControlOuter>
            <VolumeControlInner>
                <Box mr="1rem">
                    <VolumeButton volume={globalVolume} />
                </Box>
                <Box flexGrow={1}>
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={globalVolume}
                        aria-label="Master Volume Control"
                        getAriaValueText={(value) => 'Volume Level ' + Math.floor(value * 100) + '%'}
                        onChange={(_, val) => setGlobalVolume(val as number)}
                    />
                </Box>
            </VolumeControlInner>
        </VolumeControlOuter>
    );
};

const MainApp: FC = () => {
    const { state, name } = useContext(WorkspaceContext);
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
            <MainContainer>
                {players.length > 0 ? (
                    <Typography variant="h4">Listening to: {name}</Typography>
                ) : (
                    <Typography variant="h4">{name}</Typography>
                )}
                <Typography variant="subtitle1">Adjust your volume below.</Typography>
                <MajorVolumeControls />
                {blocked && (
                    <Typography color="error" variant="h5">
                        Please click anywhere on the screen to enable audio.
                    </Typography>
                )}
            </MainContainer>
            <Fetchers>{fetchers}</Fetchers>
            <Box display="none">{players}</Box>
        </>
    );
};

const Host: FunctionComponent<{
    workspace: string;
}> = ({ workspace }) => (
    <Root workspace={workspace}>
        <MainApp />
    </Root>
);

export default Host;

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            workspace: context.query.id,
        },
    };
};
