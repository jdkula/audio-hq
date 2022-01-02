/**
 * MainPlayer.tsx
 * ===============
 * One of Audio HQ's three main areas. Provides
 * audio controls for the primary track.
 */

import { Typography, Box } from '@material-ui/core';
import { FunctionComponent, useContext, useEffect, useState } from 'react';

import { AudioControls } from './AudioControls';
import { PlayStateResolver, PlayState } from '~/lib/Workspace';
import styled from 'styled-components';
import PlayIcon from '@material-ui/icons/PlayArrow';
import { WorkspaceContext } from '~/lib/useWorkspace';
import { FileManagerContext } from '~/lib/useFileManager';

const MainPlayerContainer = styled.div`
    grid-area: nowplaying;

    padding: 1rem;
    overflow: hidden;

    display: grid;
    grid-template-rows: min-content min-content;
    grid-template-columns: auto;
    row-gap: 1rem;
    border: 1px solid black;
    align-items: center;
    justify-content: center;
    justify-items: center;
    align-content: center;
    text-align: center;
`;

export const MainPlayer: FunctionComponent<{
    state: PlayState | null;
    resolver: PlayStateResolver;
}> = ({ state, resolver }) => {
    if (!state) {
        return (
            <MainPlayerContainer>
                <Typography variant="h4">Nothing Playing</Typography>
                <Box clone display="flex" alignItems="center" mt="0.5rem">
                    <Typography variant="subtitle1">
                        Use the <PlayIcon /> button to add some!
                    </Typography>
                </Box>
            </MainPlayerContainer>
        );
    }

    const ws = useContext(WorkspaceContext);

    const [n, setN] = useState(0);
    const [trackName, setTrackName] = useState('Loading...');

    useEffect(() => {
        const handle = window.setInterval(() => setN((n) => n + 1), 500);
        return () => window.clearInterval(handle);
    }, []);

    useEffect(() => {
        const trackName = ws.getCurrentTrackFrom(state)?.file.name;
        setTrackName(trackName ?? 'Loading...');
    }, [n, state]);

    return (
        <MainPlayerContainer>
            <Typography variant="h5">{trackName ?? 'Loading...'}</Typography>
            <AudioControls state={state} resolver={resolver} />
        </MainPlayerContainer>
    );
};
