/**
 * FileEntry/PlayControls.tsx
 * ==========================
 * Provides the ability to play a song on main
 * or as ambience.
 */

import styled from '@emotion/styled';
import { File } from '~/lib/Workspace';

import PlayArrow from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { DraggableStateSnapshot } from 'react-beautiful-dnd';
import { Tooltip, IconButton } from '@mui/material';
import { WorkspaceContext } from '~/lib/useWorkspace';
import { BlurOn } from '@mui/icons-material';
import useAlt from '~/lib/useAlt';

const PlayControlsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-items: center;
    grid-area: playcontrols;
`;

interface PlayControlsProps {
    snapshot: DraggableStateSnapshot;
    file: File;
}

const PlayControls: FC<PlayControlsProps> = ({ snapshot, file }) => {
    const workspace = useContext(WorkspaceContext);
    const [highlightingSfx, setSfxHighlight] = useState(false);

    const altKey = useAlt();

    const sfxHighlightTimeoutHandle = useRef<number | null>(null);

    useEffect(
        () => () => {
            if (sfxHighlightTimeoutHandle.current) {
                clearTimeout(sfxHighlightTimeoutHandle.current);
            }
        },
        [],
    );

    const onAmbience = async () => {
        workspace.resolver({ ambience: { queue: [file.id], timePlayed: 0, pauseTime: null } });
    };

    const onPlay = async () => {
        workspace.resolver({ playing: { queue: [file.id], timePlayed: 0, pauseTime: null } });
    };

    const onSfx = async () => {
        setSfxHighlight(true);
        sfxHighlightTimeoutHandle.current = setTimeout(() => {
            setSfxHighlight(false);
            sfxHighlightTimeoutHandle.current = null;
        }, 2000) as unknown as number;

        workspace.resolver({
            sfx: {
                queue: [file.id],
                timePlayed: 0,
                pauseTime: null,
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
                        <PlayArrow color={workspace.state.playing?.queue.includes(file.id) ? 'primary' : undefined} />
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
                                workspace.state.ambience.find((ps) => ps.queue.includes(file.id))
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
