import { makeStyles, Paper, Typography, Box } from '@material-ui/core';
import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { WorkspaceContext } from '../../pages/[id]';
import { AudioControls } from './AudioControls';
import { PlayStateResolver } from '../../lib/Workspace';

import AddIcon from '@material-ui/icons/Add';

const AmbienceContainer = styled.div`
    border: 1px solid black;
    grid-area: ambience;
`;

const AmbienceScrollContainer = styled.div`
    overflow: auto;
    height: 100%;
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

export const Ambience: FunctionComponent = () => {
    const workspace = useContext(WorkspaceContext);

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

    const controls = workspace.state.ambience.map((ps) => (
        <AmbienceControlsContainer key={ps.id}>
            <Typography variant="h5">{workspace.files.find((f) => f.id === ps.id)?.name ?? 'Loading...'}</Typography>
            <AudioControls state={ps} resolver={makeResolver(ps.id)} />
        </AmbienceControlsContainer>
    ));

    if (controls.length === 0) {
        return (
            <AmbienceContainer>
                <EmptyContainer>
                    <Typography variant="h4">No Ambience Playing</Typography>
                    <Box clone display="flex" alignItems="center">
                        <Typography variant="subtitle1">
                            Use the <AddIcon /> button to add some!
                        </Typography>
                    </Box>
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
