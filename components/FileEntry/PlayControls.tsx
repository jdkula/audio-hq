/**
 * FileEntry/PlayControls.tsx
 * ==========================
 * Provides the ability to play a song on main
 * or as ambience.
 */

import styled from 'styled-components';
import { File } from '~/lib/Workspace';

import PlayArrow from '@material-ui/icons/PlayArrow';
import AddIcon from '@material-ui/icons/Add';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { DraggableStateSnapshot } from 'react-beautiful-dnd';
import { Tooltip, IconButton } from '@material-ui/core';
import { WorkspaceContext } from '~/lib/useWorkspace';
import { BlurOn } from '@material-ui/icons';

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
        workspace.resolver({ ambience: { id: file.id, startTimestamp: Date.now(), pauseTime: null } });
    };

    const onPlay = async () => {
        workspace.resolver({ playing: { id: file.id, startTimestamp: Date.now(), pauseTime: null } });
    };

    const onSfx = async () => {
        setSfxHighlight(true);
        sfxHighlightTimeoutHandle.current = setTimeout(() => {
            setSfxHighlight(false);
            sfxHighlightTimeoutHandle.current = null;
        }, 2000) as unknown as number;

        workspace.resolver({
            sfx: {
                id: file.id,
                startTimestamp: Date.now(),
                pauseTime: null,
            },
        });
    };
    return (
        <PlayControlsContainer>
            <Tooltip title="Play File" placement="left" arrow>
                <IconButton onClick={onPlay}>
                    {snapshot.combineTargetFor ? (
                        <CreateNewFolderIcon color="primary" />
                    ) : (
                        <PlayArrow color={workspace.state.playing?.id === file.id ? 'primary' : undefined} />
                    )}
                </IconButton>
            </Tooltip>
            <Tooltip title="Play File As Ambience" placement="left" arrow>
                <IconButton onClick={onAmbience}>
                    <AddIcon color={workspace.state.ambience.find((ps) => ps.id === file.id) ? 'primary' : undefined} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Play File As SFX" placement="left" arrow>
                <IconButton onClick={onSfx}>
                    <BlurOn color={highlightingSfx ? 'primary' : undefined} />
                </IconButton>
            </Tooltip>
        </PlayControlsContainer>
    );
};

export default PlayControls;
