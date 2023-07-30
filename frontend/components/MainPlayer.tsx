/**
 * MainPlayer.tsx
 * ===============
 * One of Audio HQ's three main areas. Provides
 * audio controls for the primary track.
 */

import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { FunctionComponent, useContext, useMemo } from 'react';

import { AudioControls } from './AudioControls';
import styled from '@emotion/styled';
import PlayIcon from '@mui/icons-material/PlayArrow';
import ListHeader from './ListHeader';
import useAudio from '../lib/audio/useAudioDetail';
import { Deck } from '~/lib/api/models';
import { useUpdateDeckMutation } from '~/lib/api/hooks';
import { WorkspaceIdContext } from '~/lib/utility/context';
import { useLocalReactiveValue } from '~/lib/LocalReactive';
import { hideDescriptionsLRV } from '~/lib/utility/usePersistentData';
import { HighlightOff } from '@mui/icons-material';
import { differenceInSeconds, subSeconds } from 'date-fns';

const MainPlayerContainer = styled.div`
    grid-area: nowplaying;

    padding: 1rem;
    overflow: hidden;

    display: grid;
    grid-template-rows: min-content min-content auto auto;
    grid-template-columns: auto;
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

    const trackInfo = state?.queue.map((qe) => ({ name: qe.name, description: qe.description }));

    const tracksQueued = useMemo(
        () =>
            !audioInfo || !trackInfo
                ? []
                : [...trackInfo.slice(audioInfo.index + 1), ...trackInfo.slice(0, audioInfo.index)],
        [trackInfo, audioInfo],
    );

    const [hideDescriptions] = useLocalReactiveValue(hideDescriptionsLRV);

    if (!state) {
        return (
            <MainPlayerContainer>
                <Typography variant="h4">Nothing Playing</Typography>
                <PlayTypography variant="subtitle1">
                    Use the <PlayIcon /> button to play some music!
                </PlayTypography>
            </MainPlayerContainer>
        );
    }

    const skipTo = (idx: number) => {
        const newQueue = [...state.queue.slice(idx + 1), ...state.queue.slice(0, idx + 1)];
        updateDeck.mutate({
            deckId: state.id,
            update: {
                ...state,
                queue: newQueue,
                startTimestamp: new Date(),
                pauseTimestamp: null,
            },
        });
    };

    const removeFromQueue = (idx: number) => {
        const startDate = state.pauseTimestamp ?? new Date();
        let timeElapsed =
            differenceInSeconds(startDate, state.startTimestamp) %
            state.queue.reduce((seconds, next) => next.length + seconds, 0);
        if (idx < audioInfo.index) {
            timeElapsed -= state.queue[idx].length;
        }

        const newQueue = [...state.queue.slice(0, idx), ...state.queue.slice(idx + 1)];
        updateDeck.mutate({
            deckId: state.id,
            update: {
                ...state,
                queue: newQueue,
                startTimestamp: subSeconds(startDate, timeElapsed),
            },
        });
    };

    return (
        <MainPlayerContainer>
            <Typography
                variant="h5"
                component="span"
                style={{ marginBottom: trackInfo?.[audioInfo.index]?.description && !hideDescriptions ? 0 : '1rem' }}
            >
                {trackInfo?.[audioInfo.index]?.name ?? 'Loading...'}
            </Typography>
            {trackInfo?.[audioInfo.index]?.description && !hideDescriptions && (
                <Typography
                    variant="body2"
                    component="span"
                    style={{ marginBottom: '1rem', fontSize: '8pt', opacity: 0.7 }}
                    fontStyle="italic"
                >
                    {trackInfo?.[audioInfo.index]?.description ?? 'Loading...'}
                </Typography>
            )}
            <AudioControls state={state} />
            {tracksQueued.length >= 1 && (
                <>
                    <ListHeader>Up Next</ListHeader>
                    <div
                        style={{
                            overflowY: 'auto',
                            placeSelf: 'stretch',
                        }}
                    >
                        <List>
                            {tracksQueued.map((trackInfo, idx) => (
                                <ListItem
                                    disableGutters
                                    disablePadding
                                    key={idx}
                                    secondaryAction={
                                        <IconButton
                                            onClick={() =>
                                                removeFromQueue((audioInfo.index + idx + 1) % state.queue.length)
                                            }
                                        >
                                            <HighlightOff />
                                        </IconButton>
                                    }
                                >
                                    <ListItemButton onClick={() => skipTo(audioInfo.index + idx)}>
                                        <ListItemIcon>
                                            <PlayIcon />
                                        </ListItemIcon>
                                        <ListItemText>{trackInfo.name}</ListItemText>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </>
            )}
        </MainPlayerContainer>
    );
};
