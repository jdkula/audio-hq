import React, { FC, FunctionComponent, useContext, useState } from 'react';
import { Header } from '~/components/Header';
import { MainPlayer } from '~/components/MainPlayer';
import { Explorer } from '~/components/Explorer';
import { Ambience } from '~/components/Ambience';
import { GetServerSideProps } from 'next';
import { WorkspaceContext } from '~/lib/useWorkspace';
import styled from 'styled-components';
import { AppBar, Tab, Tabs, useMediaQuery, useTheme } from '@material-ui/core';
import Root from '~/components/Root';

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
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

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
            <Ambience />
        </>
    );
};

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

const Host: FunctionComponent<{
    workspace: string;
}> = ({ workspace }) => (
    <Root workspace={workspace}>
        <Container>
            <MainApp />
        </Container>
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
