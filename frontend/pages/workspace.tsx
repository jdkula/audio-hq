/**
 * workspace.ts
 * =============
 * Provides Audio HQ's workspace view (all the audio controls!)
 */

import React, { FC, FunctionComponent, useContext, useEffect, useState } from 'react';
import { Header } from '~/components/Header';
import { MainPlayer } from '~/components/MainPlayer';
import { Explorer } from '~/components/Explorer';
import { Ambience } from '~/components/Ambience';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { AppBar, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import Root from '~/components/Root';
import { WorkspaceIdContext } from '~/lib/utility/context';
import { useLocalRecents } from '~/lib/utility/usePersistentData';
import { useWorkspaceDecks } from '~/lib/api/hooks';

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
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    const [tabValue, setTabValue] = useState(0);

    const workspaceId = useContext(WorkspaceIdContext);
    const { main, ambience, sfx } = useWorkspaceDecks(workspaceId);

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
                    <TabContainer style={{ display: tabValue === 0 ? undefined : 'none' }}>
                        <MainPlayer state={main} />
                    </TabContainer>
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
            <MainPlayer state={main} />
            <Explorer />
            {(ambience.length > 0 || sfx.length > 0) && <Ambience />}
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
    const workspaceId = useContext(WorkspaceIdContext);
    const { ambience, sfx } = useWorkspaceDecks(workspaceId);

    const [, addRecents] = useLocalRecents();
    useEffect(() => {
        if (workspaceId) {
            addRecents(workspaceId);
        }
    }, [addRecents, workspaceId]);

    return (
        <Container hideAmbience={ambience.length + sfx.length === 0}>
            <MainApp />
        </Container>
    );
};

const Host: FunctionComponent = () => {
    const [workspaceId, setWorkspaceId] = useState('');

    useEffect(() => {
        setWorkspaceId(window.location.hash.substring(1));
    }, []);

    return (
        <Root workspace={workspaceId}>
            <Sub />
        </Root>
    );
};

export default Host;
