/**
 * Ambience.tsx
 * ========================
 * One of the three main AudioHQ sections.
 * Displays controls for all ambient tracks playing in the workspace.
 */

import { Paper, Tooltip, Typography } from '@material-ui/core';
import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { WorkspaceContext } from '~/lib/useWorkspace';
import { AudioControls } from './AudioControls';
import { PlayStateResolver } from '../lib/Workspace';

import AddIcon from '@material-ui/icons/Add';
import { BlurOn } from '@material-ui/icons';
import { useRecoilValue } from 'recoil';
import { sfxAtom } from '~/lib/atoms';

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
    text-align: center;
`;

const AmbienceControlsContainer = styled(Paper)`
    margin: 1rem;
    padding: 1rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

export const Ambience: FunctionComponent = () => {
    const workspace = useContext(WorkspaceContext);
    const sfx = useRecoilValue(sfxAtom);

    const makeResolver = (queue: string[]): PlayStateResolver => {
        return (update) => {
            if (update === null) {
                workspace.resolver({ delAmbience: queue });
            } else {
                workspace.resolver({
                    ambience: { ...update, queue: queue },
                });
            }
        };
    };

    const controls = [...workspace.state.ambience].map((ps) => (
        <AmbienceControlsContainer key={ps.queue[0]}>
            <Typography variant="h5">{workspace.getCurrentTrackFrom(ps)?.file.name ?? 'Loading...'}</Typography>
            <AudioControls state={ps} resolver={makeResolver(ps.queue)} />
        </AmbienceControlsContainer>
    ));

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
                {sfx?.sfx && (
                    <AmbienceControlsContainer>
                        <Tooltip title="Playing as SFX" arrow>
                            <BlurOn />
                        </Tooltip>
                        <Typography variant="h5">
                            {workspace.getCurrentTrackFrom(sfx.sfx)?.file.name ?? 'Loading...'}
                        </Typography>
                        <AudioControls state={sfx.sfx} resolver={sfxResolver} />
                    </AmbienceControlsContainer>
                )}
            </AmbienceScrollContainer>
        </AmbienceContainer>
    );
};
