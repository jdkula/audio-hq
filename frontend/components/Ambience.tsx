/**
 * Ambience.tsx
 * ========================
 * One of the three main AudioHQ sections.
 * Displays controls for all ambient tracks playing in the workspace.
 */

import { Collapse, Paper, Tooltip, Typography } from '@mui/material';
import { FunctionComponent, useContext } from 'react';
import styled from '@emotion/styled';
import { AudioControls } from './AudioControls';

import AddIcon from '@mui/icons-material/Add';
import { WorkspaceIdContext } from '~/lib/utility/context';
import { getDeckInfo } from '~/lib/audio/audio_util';
import { Deck_Type_Enum_Enum } from '~/lib/generated/graphql';
import { BlurOn } from '@mui/icons-material';
import { useWorkspaceDecks } from '~/lib/api/hooks';

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
    const workspaceId = useContext(WorkspaceIdContext);
    const { ambience, sfx } = useWorkspaceDecks(workspaceId);

    const controls = [...sfx, ...ambience].map((deck) => (
        <AmbienceControlsContainer key={deck.id}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip arrow title="Sound FX" placement="top" enterDelay={0}>
                    <Collapse in={deck.type === Deck_Type_Enum_Enum.Sfx}>
                        <BlurOn sx={{ marginRight: 2 }} />
                    </Collapse>
                </Tooltip>
                {getDeckInfo(deck)?.trackInfo.currentTrack.name ?? 'Loading...'}
            </Typography>
            <AudioControls state={deck} />
        </AmbienceControlsContainer>
    ));

    if (controls.length === 0) {
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
            <AmbienceScrollContainer>{controls}</AmbienceScrollContainer>
        </AmbienceContainer>
    );
};
