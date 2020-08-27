import { Typography } from '@material-ui/core';
import { FunctionComponent, useContext } from 'react';

import { AudioControls } from './AudioControls';
import { PlayStateResolver, PlayState } from '~/lib/Workspace';
import styled from 'styled-components';
import { WorkspaceContext } from '~/pages/[id]/host';
import PlayIcon from '@material-ui/icons/PlayArrow';

const NowPlayingContainer = styled.div`
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

export const NowPlaying: FunctionComponent<{
    state: PlayState | null;
    resolver: PlayStateResolver;
}> = ({ state, resolver }) => {
    if (!state) {
        return (
            <NowPlayingContainer>
                <Typography variant="h4">Nothing Playing</Typography>
                <Typography variant="subtitle1">
                    Use the <PlayIcon /> button to add some!
                </Typography>
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
