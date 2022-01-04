import React, { FC, FunctionComponent, useContext, useEffect, useState } from 'react';
import { Header } from '~/components/Header';
import { MainPlayer } from '~/components/MainPlayer';
import { Explorer } from '~/components/Explorer';
import { Ambience } from '~/components/Ambience';
import { GetServerSideProps } from 'next';
import { WorkspaceContext } from '~/lib/useWorkspace';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { AppBar, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import Root from '~/components/Root';
import useLocalRecents from '~/lib/useLocalRecents';

const TabContainer = styled.div`
    grid-area: tabcontent;
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: auto;
    & > * {
        grid-area: unset;
        overflow: auto;
    }
`;

const MainApp: FC = () => {
    const { state, resolver } = useContext(WorkspaceContext);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    const [tabValue, setTabValue] = useState(0);

    const nowPlaying = <MainPlayer resolver={(update) => resolver({ playing: update })} state={state.playing} />;

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
            {state.ambience.length > 0 && <Ambience />}
        </>
    );
};

const Container = styled.div<{ hideAmbience?: boolean }>`
    display: grid;
    grid-template-columns: 50% 30% 20%;
    grid-template-rows: 65px 40% auto 40%;
    ${({ hideAmbience }) =>
        hideAmbience
            ? css`
                  grid-template-areas:
                      'header     header   header  '
                      'nowplaying explorer explorer'
                      'nowplaying   explorer explorer'
                      'nowplaying   explorer explorer';
              `
            : css`
                  grid-template-areas:
                      'header     header   header  '
                      'nowplaying explorer explorer'
                      'ambience   explorer explorer'
                      'ambience   explorer explorer';
              `}

    height: 100vh;

    ${({ theme }) => theme.breakpoints.down('md')} {
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

const Sub: FC = () => {
    const { state } = useContext(WorkspaceContext);
    return (
        <Container hideAmbience={state.ambience.length === 0}>
            <MainApp />
        </Container>
    );
};

const Host: FunctionComponent<{
    workspace: string;
}> = ({ workspace }) => {
    const [, addRecents] = useLocalRecents();

    useEffect(() => {
        if (workspace) {
            addRecents(workspace);
        }
    }, [workspace]);

    return (
        <Root workspace={workspace}>
            <Sub />
        </Root>
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
