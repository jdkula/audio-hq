/**
 * Ambience.tsx
 * ========================
 * One of the three main AudioHQ sections.
 * Displays controls for all ambient tracks playing in the workspace.
 */

import { Paper, Tooltip, Typography } from '@material-ui/core';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { WorkspaceContext } from '~/lib/useWorkspace';
import { AudioControls } from './AudioControls';
import { PlayState, PlayStateResolver, SfxState, updatePlayState } from '../lib/Workspace';

import AddIcon from '@material-ui/icons/Add';
import { BlurOn } from '@material-ui/icons';

const AmbienceContainer = styled.div`
    border: 1px solid black;
    grid-area: ambience;
`;

const AmbienceScrollContainer = styled.div`
    overflow: auto;
    height: 100%;
`;

const CenteredTypography = styled(Typography)`
    display: flex;
    align-items: center;
`;

const EmptyContainer = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    row-gap: 1rem;
    grid-template-columns: auto;
    justify-items: center;
    justify-content: center;
    align-content: center;
    align-items: center;
`;

const AmbienceControlsContainer = styled(Paper)`
    margin: 1rem;
    padding: 1rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

export const shouldPlaySFX = (sfx: SfxState): boolean => {
    const lastTrigger = parseInt(localStorage.getItem('__AHQ_LAST_SFX') ?? '0');
    const valid = !!sfx.sfx && sfx.timeoutTimestamp > Date.now() && sfx.triggerTimestamp > lastTrigger;

    if (valid) {
        localStorage.setItem('__AHQ_LAST_SFX', JSON.stringify(sfx.triggerTimestamp));
    }
    return valid;
};

export const Ambience: FunctionComponent = () => {
    const workspace = useContext(WorkspaceContext);
    const [sfx, setSfx] = useState<PlayState | null>(null);

    const makeResolver = (id: string): PlayStateResolver => {
        return (update) => {
            if (update === null) {
                workspace.resolver({ delAmbience: id });
            } else {
                workspace.resolver({
                    ambience: { ...update, id },
                });
            }
        };
    };

    const controls = [...workspace.state.ambience].map((ps) => (
        <AmbienceControlsContainer key={ps.id}>
            <Typography variant="h5">{workspace.files.find((f) => f.id === ps.id)?.name ?? 'Loading...'}</Typography>
            <AudioControls state={ps} resolver={makeResolver(ps.id)} />
        </AmbienceControlsContainer>
    ));

    useEffect(() => {
        if (
            shouldPlaySFX(workspace.state.sfx) ||
            (sfx && (workspace.state.sfx.sfx?.id === sfx.id || workspace.state.sfx.sfx === null))
        ) {
            setSfx(workspace.state.sfx.sfx);
        }
    }, [workspace.state.sfx]);

    const sfxResolver: PlayStateResolver = (update) => {
        if (update === null) {
            workspace.resolver({
                sfx: null,
                sfxMerge: true,
            });
        } else {
            workspace.resolver({
                sfx: update,
                sfxMerge: true,
            });
        }
    };

    if (controls.length === 0 && !sfx) {
        return (
            <AmbienceContainer>
                <EmptyContainer>
                    <Typography variant="h4">No Ambience Playing</Typography>
                    <CenteredTypography variant="subtitle1">
                        Use the <AddIcon /> button to add some!
                    </CenteredTypography>
                </EmptyContainer>
            </AmbienceContainer>
        );
    }

    return (
        <AmbienceContainer>
            <AmbienceScrollContainer>
                {controls}
                {sfx && (
                    <AmbienceControlsContainer>
                        <Tooltip title="Playing as SFX" arrow>
                            <BlurOn />
                        </Tooltip>
                        <Typography variant="h5">
                            {workspace.files.find((f) => f.id === sfx.id)?.name ?? 'Loading...'}
                        </Typography>
                        <AudioControls state={sfx} resolver={sfxResolver} loop={false} onFinish={() => setSfx(null)} />
                    </AmbienceControlsContainer>
                )}
            </AmbienceScrollContainer>
        </AmbienceContainer>
    );
};
