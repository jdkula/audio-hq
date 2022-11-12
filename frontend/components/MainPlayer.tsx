/**
 * MainPlayer.tsx
 * ===============
 * One of Audio HQ's three main areas. Provides
 * audio controls for the primary track.
 */

import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { FunctionComponent, useContext, useMemo } from 'react';

import { AudioControls } from './AudioControls';
import styled from '@emotion/styled';
import PlayIcon from '@mui/icons-material/PlayArrow';
import ListHeader from './ListHeader';
import useAudio from '../lib/audio/useAudioDetail';
import { Deck } from '~/lib/api/models';
import { useUpdateDeckMutation } from '~/lib/api/hooks';
import { WorkspaceIdContext } from '~/lib/utility/context';

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
    state: Deck | null;
}> = ({ state }) => {
    const wsId = useContext(WorkspaceIdContext);
    const audioInfo = useAudio(state);

    const updateDeck = useUpdateDeckMutation(wsId);

    const trackNames = state?.queue.map((qe) => qe.name);

    const tracksQueued = useMemo(
        () =>
            !audioInfo || !trackNames
                ? []
                : [...trackNames.slice(audioInfo.index + 1), ...trackNames.slice(0, audioInfo.index + 1)],
        [trackNames, audioInfo],
    );

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

    const skipTo = (idx: number) => {
        const newQueue = [...state.queue.slice(idx + 1), ...state.queue.slice(0, idx + 1)];
        updateDeck.mutate({
            deckId: state.id,
            update: {
                queue: newQueue,
                startTimestamp: new Date(),
                pauseTimestamp: null,
            },
        });
    };

    return (
        <MainPlayerContainer>
            <Typography variant="h5" component="span">
                {trackNames?.[audioInfo.index] ?? 'Loading...'}
            </Typography>
            <AudioControls state={state} />
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
                                <ListItemButton key={idx} onClick={() => skipTo(audioInfo.index + idx)}>
                                    <ListItemIcon>
                                        <PlayIcon />
                                    </ListItemIcon>
                                    <ListItemText>{trackName}</ListItemText>
                                </ListItemButton>
                            ))}
                        </List>
                    </div>
                </>
            )}
        </MainPlayerContainer>
    );
};
