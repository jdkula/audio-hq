/**
 * FileEntry/PlayControls.tsx
 * ==========================
 * Provides the ability to play a song on main
 * or as ambience.
 */

import styled from '@emotion/styled';

import PlayArrow from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { DraggableStateSnapshot } from 'react-beautiful-dnd';
import { IconButton, Tooltip } from '@mui/material';
import { BlurOn } from '@mui/icons-material';
import { File_Minimum } from '../../lib/urql/graphql_type_helper';
import { Deck_Type_Enum_Enum, usePlayDeckMutation } from '../../lib/generated/graphql';
import { v4 } from 'uuid';
import { useWorkspaceDecks } from '~/lib/useWorkspaceDetails';
import { WorkspaceIdContext } from '~/lib/utility/context';
import { useAlt } from '~/lib/utility/hooks';

const PlayControlsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
    grid-area: playcontrols;
`;

interface PlayControlsProps {
    snapshot: DraggableStateSnapshot;
    file: File_Minimum;
}

const PlayControls: FC<PlayControlsProps> = ({ snapshot, file }) => {
    const workspaceId = useContext(WorkspaceIdContext);
    const [highlightingSfx, setSfxHighlight] = useState(false);
    const { main, ambience } = useWorkspaceDecks(workspaceId);

    const altKey = useAlt();

    const sfxHighlightTimeoutHandle = useRef<number | null>(null);

    const [, playDeck] = usePlayDeckMutation();

    useEffect(
        () => () => {
            if (sfxHighlightTimeoutHandle.current) {
                clearTimeout(sfxHighlightTimeoutHandle.current);
            }
        },
        [],
    );

    const onAmbience = async () => {
        playDeck({
            workspaceId,
            deck: {
                id: v4(),
                workspace_id: workspaceId,
                queue: { data: [{ file_id: file.id, ordering: 0, id: v4() }] },
                type: Deck_Type_Enum_Enum.Ambience,
                pause_timestamp: null,
                start_timestamp: new Date().toISOString(),
                speed: main?.speed ?? 1,
                volume: main?.volume ?? 1,
            },
        });
    };

    const onPlay = async () => {
        playDeck({
            workspaceId,
            isMain: true,
            deck: {
                id: v4(),
                workspace_id: workspaceId,
                queue: { data: [{ file_id: file.id, ordering: 0, id: v4() }] },
                type: Deck_Type_Enum_Enum.Main,
                pause_timestamp: null,
                start_timestamp: new Date().toISOString(),
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

        playDeck({
            workspaceId,
            deck: {
                id: v4(),
                workspace_id: workspaceId,
                queue: { data: [{ file_id: file.id, ordering: 0, id: v4() }] },
                type: Deck_Type_Enum_Enum.Sfx,
                pause_timestamp: null,
                start_timestamp: new Date().toISOString(),
            },
        });
    };
    return (
        <PlayControlsContainer>
            <Tooltip title="Play File" placement="left" arrow>
                <IconButton onClick={onPlay} size="large">
                    {snapshot.combineTargetFor ? (
                        <CreateNewFolderIcon color="primary" />
                    ) : (
                        <PlayArrow color={main?.queue.find((qe) => qe.file.id === file.id) ? 'primary' : undefined} />
                    )}
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
                                ambience.find((ps) => ps.queue.map((q) => q.file.id).includes(file.id))
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
