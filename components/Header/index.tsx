/**
 * Header/index.tsx
 * ===============================
 * Provides the app's global header, which allows
 * the user to return to the main menu, adjust global
 * volume, cache all workspace songs, and add tracks.
 */

import { AppBar, Toolbar, Typography, Button, useMediaQuery, useTheme, Hidden } from '@material-ui/core';
import AddFileDialog from '../AddFileDialog';
import React, { useContext, FunctionComponent, useState, FC } from 'react';
import { FileManagerContext } from '~/lib/useFileManager';
import Head from 'next/head';
import { Add } from '@material-ui/icons';
import { useRecoilValue } from 'recoil';

import { useRouter } from 'next/router';
import { pathAtom } from '~/lib/atoms';
import { WorkspaceContext } from '~/lib/useWorkspace';
import styled from 'styled-components';
import GlobalVolumeSlider from './GlobalVolumeSlider';
import DownloadCacheButton from './DownloadCacheButton';

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
        <Hidden xsDown>
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
    const workspace = useContext(WorkspaceContext);
    const fileManager = useContext(FileManagerContext);
    const router = useRouter();

    const [adding, setAdding] = useState(false);

    const path = useRecoilValue(pathAtom);

    const allCached = fileManager.cached.size === workspace.files.length;

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppBar position="static" style={{ gridArea: 'header' }}>
            <AddFileDialog open={adding} onClose={() => setAdding(false)} currentPath={path} />
            <Head>
                <title>
                    Audio HQ – {workspace ? workspace.name : 'Loading...'}
                    {!host ? ' – Minimal View' : ''}
                </title>
            </Head>
            <Toolbar>
                <ToolbarContent>
                    <Title>
                        <Typography
                            variant={isSmall ? 'h5' : 'h4'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => router.push(`/?last=${encodeURIComponent(workspace.name)}`)}
                        >
                            Audio HQ – {workspace ? workspace.name : 'Loading...'}
                        </Typography>
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
