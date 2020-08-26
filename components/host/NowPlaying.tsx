import { makeStyles, Button, Typography } from '@material-ui/core';
import { FunctionComponent, useContext } from 'react';

import { AudioControls } from './AudioControls';
import { WorkspaceState, PlayStateResolver, PlayState } from '~/lib/Workspace';
import { Seeker } from '../Seeker';
import styled from 'styled-components';
import { WorkspaceContext } from '~/pages/[id]/host';

const NowPlayingContainer = styled.div`
    grid-area: nowplaying;

    display: grid;
    grid-template-rows: min-content min-content;
    grid-template-columns: auto;
    row-gap: 1rem;
    border: 1px solid black;
    align-items: center;
    justify-content: center;
    align-content: center;
`;

export const NowPlaying: FunctionComponent<{
    state: PlayState | null;
    resolver: PlayStateResolver;
}> = ({ state, resolver }) => {
    if (!state) {
        return (
            <NowPlayingContainer>
                <Typography variant="h4">Nothing Playing</Typography>
            </NowPlayingContainer>
        );
    }

    const ws = useContext(WorkspaceContext);

    const songName = ws.files.find((f) => f.id === ws.state.playing?.id)?.name;

    return (
        <NowPlayingContainer>
            <Typography variant="h5">{songName ?? '不明'}</Typography>
            <AudioControls state={state} resolver={resolver} />
        </NowPlayingContainer>
    );
};
