/**
 * FileEntry/PlayControls.tsx
 * ==========================
 * Provides the ability to play a song on main
 * or as ambience.
 */

import styled from '@emotion/styled';

import PlayArrow from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { BlurOn } from '@mui/icons-material';
import { WorkspaceIdContext } from '~/lib/utility/context';
import { useAlt } from '~/lib/utility/hooks';
import * as API from '~/lib/api/models';
import { usePlayDeckMutation, useWorkspaceDecks } from '~/lib/api/hooks';

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
    const workspaceId = useContext(WorkspaceIdContext);
    const [highlightingSfx, setSfxHighlight] = useState(false);
    const { main, ambience } = useWorkspaceDecks(workspaceId);

    const altKey = useAlt();

    const sfxHighlightTimeoutHandle = useRef<number | null>(null);

    const playDeck = usePlayDeckMutation(workspaceId);

    useEffect(
        () => () => {
            if (sfxHighlightTimeoutHandle.current) {
                clearTimeout(sfxHighlightTimeoutHandle.current);
            }
        },
        [],
    );

    const onAmbience = async () => {
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
        setSfxHighlight(true);
        sfxHighlightTimeoutHandle.current = setTimeout(() => {
            setSfxHighlight(false);
            sfxHighlightTimeoutHandle.current = null;
        }, 2000) as unknown as number;

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
    };
    return (
        <PlayControlsContainer>
            <Tooltip title="Play File" placement="left" arrow>
                <IconButton onClick={onPlay} size="large">
                    <PlayArrow color={main?.queue.find((qe) => qe.id === file.id) ? 'primary' : undefined} />
                </IconButton>
            </Tooltip>
            {altKey ? (
                <Tooltip title="Play File As SFX" placement="left" arrow>
                    <IconButton onClick={onSfx} size="large">
                        <BlurOn color={highlightingSfx ? 'primary' : undefined} />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Play File As Ambience (alt/option to play as SFX)" placement="left" arrow>
                    <IconButton onClick={onAmbience} size="large">
                        <AddIcon
                            color={
                                ambience.find((ps) => ps.queue.map((q) => q.id).includes(file.id))
                                    ? 'primary'
                                    : undefined
                            }
                        />
                    </IconButton>
                </Tooltip>
            )}
        </PlayControlsContainer>
    );
};

export default PlayControls;
