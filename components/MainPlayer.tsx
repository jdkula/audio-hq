/**
 * MainPlayer.tsx
 * ===============
 * One of Audio HQ's three main areas. Provides
 * audio controls for the primary track.
 */

import { Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { FunctionComponent, useContext, useMemo, useState } from 'react';

import { AudioControls } from './AudioControls';
import { PlayStateResolver, PlayState } from '~/lib/Workspace';
import styled from '@emotion/styled';
import PlayIcon from '@mui/icons-material/PlayArrow';
import { WorkspaceContext } from '~/lib/useWorkspace';
import usePeriodicEffect from '~/lib/usePeriodicEffect';
import ListHeader from './ListHeader';

const MainPlayerContainer = styled.div`
    grid-area: nowplaying;

    padding: 1rem;
    overflow: hidden;

    display: grid;
    grid-template-rows: min-content min-content auto auto;
    grid-template-columns: auto;
    row-gap: 1rem;
    border: 1px solid black;
    align-items: center;
    justify-content: center;
    justify-items: center;
    align-content: center;
    text-align: center;
`;

const PlayTypography = styled(Typography)`
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
`;

export const MainPlayer: FunctionComponent<{
    state: PlayState | null;
    resolver: PlayStateResolver;
}> = ({ state, resolver }) => {
    if (!state) {
        return (
            <MainPlayerContainer>
                <Typography variant="h4">Nothing Playing</Typography>
                <PlayTypography variant="subtitle1">
                    Use the <PlayIcon /> button to add some!
                </PlayTypography>
            </MainPlayerContainer>
        );
    }

    const ws = useContext(WorkspaceContext);

    const trackNames = useMemo(
        () => state.queue.map((id) => ws.files.find((f) => f.id === id)).map((f) => f?.name ?? 'Loading...'),
        [state],
    );

    const [currIdx, setCurrIdx] = useState(0);

    const tracksQueued = useMemo(
        () => [...trackNames.slice(currIdx + 1), ...trackNames.slice(0, currIdx + 1)],
        [trackNames, currIdx],
    );

    const skipTo = (idx: number) => {
        ws.resolver({
            playing: { queue: [...state.queue.slice(idx + 1), ...state.queue.slice(0, idx + 1)], timePlayed: 0 },
        });
    };

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
            <Typography variant="h5" component="span">
                {trackNames[currIdx] ?? 'Loading...'}
            </Typography>
            <AudioControls state={state} resolver={resolver} />
            {tracksQueued.length > 1 && (
                <>
                    <ListHeader>Up Next</ListHeader>
                    <div
                        style={{
                            overflowY: 'auto',
                            placeSelf: 'stretch',
                        }}
                    >
                        <List>
                            {tracksQueued.map((trackName, idx) => (
                                <ListItem button key={idx} onClick={() => skipTo(currIdx + idx)}>
                                    <ListItemIcon>
                                        <PlayIcon />
                                    </ListItemIcon>
                                    <ListItemText>{trackName}</ListItemText>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </>
            )}
        </MainPlayerContainer>
    );
};
