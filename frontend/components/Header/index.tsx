/**
 * Header/index.tsx
 * ===============================
 * Provides the app's global header, which allows
 * the user to return to the main menu, adjust global
 * volume, cache all workspace songs, and add tracks.
 */

import { AppBar, Button, Hidden, Link, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import AddFileDialog from '../AddFileDialog';
import React, { FC, FunctionComponent, useContext, useState } from 'react';
import Head from 'next/head';
import { Add } from '@mui/icons-material';
import styled from '@emotion/styled';
import GlobalVolumeSlider from './GlobalVolumeSlider';
import DownloadCacheButton from './DownloadCacheButton';
import NextLink from 'next/link';
import { WorkspaceIdContext, WorkspaceNameContext } from '../../lib/utility';
import { FileManagerContext } from '../../lib/useFileManager';
import { useWorkspaceFilesQuery } from '../../lib/generated/graphql';
import { useLocalReactiveValue } from '../../lib/local_reactive';
import { currentPathLRV } from '../../lib/global_lrv';

const ToolbarContent = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
`;

const Title = styled.div`
    flex-grow: 1;

    display: flex;
    align-items: center;
`;

const Spacer = styled.div`
    margin: 1rem;
`;

const AddTrackButton: FC<{ startAdding: () => void }> = ({ startAdding }) => (
    <>
        <Hidden smDown>
            <Button variant="contained" color="secondary" onClick={startAdding} startIcon={<Add />}>
                Add a Track
            </Button>
        </Hidden>
        <Hidden smUp>
            <Button variant="contained" color="secondary" onClick={startAdding}>
                <Add />
            </Button>
        </Hidden>
    </>
);

export const Header: FunctionComponent<{ host?: boolean }> = ({ host }) => {
    const workspaceId = useContext(WorkspaceIdContext);
    const workspaceName = useContext(WorkspaceNameContext);
    const fileManager = useContext(FileManagerContext);

    const [{ data: filesRaw }] = useWorkspaceFilesQuery({ variables: { workspaceId } });
    const files = filesRaw?.file ?? [];

    const [adding, setAdding] = useState(false);

    const [path] = useLocalReactiveValue(currentPathLRV);

    const allCached = fileManager.cached.length === files.length; // TODO

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <AppBar position="static" style={{ gridArea: 'header' }}>
            <AddFileDialog open={adding} onClose={() => setAdding(false)} currentPath={path} />
            <Head>
                <title>
                    Audio HQ – {workspaceName || 'Loading...'}
                    {!host ? ' – Minimal View' : ''}
                </title>
            </Head>
            <Toolbar>
                <ToolbarContent>
                    <Title>
                        <NextLink href={'/'}>
                            <Link href={'/'} color="inherit" underline="hover">
                                <Typography variant={isSmall ? 'h5' : 'h4'}>
                                    Audio HQ – {workspaceName || 'Loading...'}
                                </Typography>
                            </Link>
                        </NextLink>
                        {!isSmall && !host && (
                            <>
                                <Spacer />
                                <Typography variant="subtitle1">Minimal View</Typography>
                            </>
                        )}
                    </Title>
                    {host && <GlobalVolumeSlider />}
                    {!allCached && <DownloadCacheButton />}
                    {host && <AddTrackButton startAdding={() => setAdding(true)} />}
                </ToolbarContent>
            </Toolbar>
        </AppBar>
    );
};
