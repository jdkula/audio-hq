/**
 * FileEntry/PlayControls.tsx
 * ==========================
 * Provides the ability to play a song on main
 * or as ambience.
 */

import styled from '@emotion/styled';

import PlayArrow from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import React, { FC, useContext, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { BlurOn, OfflineBolt } from '@mui/icons-material';
import { FileManagerContext, WorkspaceIdContext } from '~/lib/utility/context';
import * as API from '~/lib/api/models';
import { usePlayDeckMutation, useWorkspaceDecks } from '~/lib/api/hooks';
import { useIsOnline } from '~/lib/utility/hooks';

const PlayControlsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
    grid-area: playcontrols;
`;

interface PlayControlsProps {
    file: API.Single;
}

const PlayControls: FC<PlayControlsProps> = ({ file }) => {
    const online = useIsOnline();
    const fileManager = useContext(FileManagerContext);
    const cached = !!fileManager.cached.has(file.url);

    const workspaceId = useContext(WorkspaceIdContext);
    const { main, ambience, sfx } = useWorkspaceDecks(workspaceId);

    const [debouncingAmbience, setDebouncingAmbience] = useState(false);
    const [debouncingSfx, setDebouncingSfx] = useState(false);

    const isPlayingAsAmbience = !!ambience.find((ps) => ps.queue.map((q) => q.id).includes(file.id));
    const isPlayingAsSFX = !!sfx.find((ps) => ps.queue.map((q) => q.id).includes(file.id));

    const playDeck = usePlayDeckMutation(workspaceId);

    const onAmbience = async () => {
        setDebouncingAmbience(true);
        playDeck.mutate({
            deck: {
                queue: [file],
                type: 'ambient',
                pauseTimestamp: null,
                startTimestamp: new Date(),
                speed: main?.speed ?? 1,
                volume: main?.volume ?? 1,
            },
        });
        setTimeout(setDebouncingAmbience, 250, false);
    };

    const onPlay = async () => {
        playDeck.mutate({
            deck: {
                queue: [file],
                type: 'main',
                pauseTimestamp: null,
                startTimestamp: new Date(),
                speed: main?.speed ?? 1,
                volume: main?.volume ?? 1,
            },
        });
    };

    const onSfx = async () => {
        setDebouncingSfx(true);
        playDeck.mutate({
            deck: {
                queue: [file],
                type: 'sfx',
                pauseTimestamp: null,
                startTimestamp: new Date(),
                speed: main?.speed ?? 1,
                volume: main?.volume ?? 1,
            },
        });
        setTimeout(setDebouncingSfx, 250, false);
    };
    return (
        <PlayControlsContainer>
            <Tooltip title="Play File" placement="left" arrow>
                <IconButton onClick={onPlay} size="large" disabled={!online && !cached}>
                    {online !== false || cached ? (
                        <PlayArrow color={main?.queue.find((qe) => qe.id === file.id) ? 'primary' : undefined} />
                    ) : (
                        <OfflineBolt />
                    )}
                </IconButton>
            </Tooltip>
            <Tooltip title="Play File As Ambience" placement="top" arrow>
                <IconButton
                    onClick={onAmbience}
                    size="small"
                    disabled={
                        (online === false && !cached) || isPlayingAsAmbience || isPlayingAsSFX || debouncingAmbience
                    }
                >
                    <AddIcon color={isPlayingAsAmbience ? 'primary' : undefined} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Play File As SFX" placement="top" arrow>
                <IconButton
                    onClick={onSfx}
                    size="small"
                    disabled={(online === false && !cached) || isPlayingAsSFX || isPlayingAsAmbience || debouncingSfx}
                >
                    <BlurOn color={isPlayingAsSFX ? 'primary' : undefined} />
                </IconButton>
            </Tooltip>
        </PlayControlsContainer>
    );
};

export default PlayControls;
