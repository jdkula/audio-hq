/**
 * MainPlayer.tsx
 * ===============
 * One of Audio HQ's three main areas. Provides
 * audio controls for the primary track.
 */

import { Typography, Box } from '@material-ui/core';
import { FunctionComponent, useContext, useEffect, useMemo, useState } from 'react';

import { AudioControls } from './AudioControls';
import { PlayStateResolver, PlayState } from '~/lib/Workspace';
import styled from 'styled-components';
import PlayIcon from '@material-ui/icons/PlayArrow';
import { WorkspaceContext } from '~/lib/useWorkspace';
import usePeriodicEffect from '~/lib/usePeriodicEffect';

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

    const trackNames = useMemo(
        () => state.queue.map((id) => ws.files.find((f) => f.id === id)).map((f) => f?.name ?? 'Loading...'),
        [state],
    );

    const [currIdx, setCurrIdx] = useState(0);

    usePeriodicEffect(
        500,
        () => {
            const idx = ws.getCurrentTrackFrom(state)?.index;
            setCurrIdx(idx ?? 0);
        },
        [state],
    );

    return (
        <MainPlayerContainer>
            <Typography variant="h5">{trackNames[currIdx] ?? 'Loading...'}</Typography>
            <AudioControls state={state} resolver={resolver} />
        </MainPlayerContainer>
    );
};
