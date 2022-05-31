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
import { useAlt, useWorkspaceStatuses, WorkspaceIdContext } from '../../lib/utility';
import { Play_Status_Type_Enum_Enum, usePlayTrackMutation } from '../../lib/generated/graphql';
import { File_Minimum } from '../../lib/graphql_type_helper';

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
    const { main, sfx, ambience } = useWorkspaceStatuses(workspaceId);

    const altKey = useAlt();

    const sfxHighlightTimeoutHandle = useRef<number | null>(null);

    const [, playSong] = usePlayTrackMutation();

    useEffect(
        () => () => {
            if (sfxHighlightTimeoutHandle.current) {
                clearTimeout(sfxHighlightTimeoutHandle.current);
            }
        },
        [],
    );

    const onAmbience = async () => {
        playSong({
            workspaceId,
            track: {
                workspace_id: workspaceId,
                queue: { data: [{ file_id: file.id }] },
                type: Play_Status_Type_Enum_Enum.Ambience,
                pause_timestamp: null,
                start_timestamp: new Date(),
            },
        });
    };

    const onPlay = async () => {
        playSong({
            workspaceId,
            isMain: true,
            track: {
                workspace_id: workspaceId,
                queue: { data: [{ file_id: file.id }] },
                type: Play_Status_Type_Enum_Enum.Main,
                pause_timestamp: null,
                start_timestamp: new Date(),
            },
        });
    };

    const onSfx = async () => {
        setSfxHighlight(true);
        sfxHighlightTimeoutHandle.current = setTimeout(() => {
            setSfxHighlight(false);
            sfxHighlightTimeoutHandle.current = null;
        }, 2000) as unknown as number;

        playSong({
            workspaceId,
            track: {
                workspace_id: workspaceId,
                queue: { data: [{ file_id: file.id }] },
                type: Play_Status_Type_Enum_Enum.Sfx,
                pause_timestamp: null,
                start_timestamp: new Date(),
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
                        <PlayArrow
                            color={
                                ambience.find((ps) => ps.queue.map((q) => q.id).includes(file.id))
                                    ? 'primary'
                                    : undefined
                            }
                        />
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
                                sfx.find((ps) => ps.queue.map((q) => q.id).includes(file.id)) ? 'primary' : undefined
                            }
                        />
                    </IconButton>
                </Tooltip>
            )}
        </PlayControlsContainer>
    );
};

export default PlayControls;
