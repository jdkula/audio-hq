/**
 * Header/index.tsx
 * ===============================
 * Provides the app's global header, which allows
 * the user to return to the main menu, adjust global
 * volume, cache all workspace songs, and add tracks.
 */

import { AppBar, Toolbar, Typography, Button, useMediaQuery, useTheme, Hidden, Link } from '@mui/material';
import AddFileDialog from '../AddFileDialog';
import React, { useContext, FunctionComponent, useState, FC } from 'react';
import Head from 'next/head';
import { Add } from '@mui/icons-material';
import { useRecoilValue } from 'recoil';

import { pathAtom } from '~/lib/atoms';
import styled from '@emotion/styled';
import GlobalVolumeSlider from './GlobalVolumeSlider';
import DownloadCacheButton from './DownloadCacheButton';
import NextLink from 'next/link';
import { WorkspaceIdContext, WorkspaceNameContext } from '../../lib/utility';
import useFileManager from '../../lib/useFileManager';
import { useWorkspaceFilesQuery } from '../../lib/generated/graphql';

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
    const fileManager = useFileManager(workspaceId);

    const [{ data: filesRaw }] = useWorkspaceFilesQuery({ variables: { workspaceId } });
    const files = filesRaw?.file ?? [];

    const [adding, setAdding] = useState(false);

    const path = useRecoilValue(pathAtom);

    const allCached = fileManager.cached.size === files.length;

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
