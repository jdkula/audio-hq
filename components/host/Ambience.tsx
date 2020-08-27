import { makeStyles, Paper, Typography } from '@material-ui/core';
import { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { WorkspaceContext } from '../../pages/[id]/host';
import { AudioControls } from './AudioControls';
import { PlayStateResolver } from '../../lib/Workspace';

const AmbienceContainer = styled.div`
    border: 1px solid black;
    grid-area: ambience;
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
        <Paper>
            <Typography variant="h4">{workspace.files.find((f) => f.id === ps.id)?.name ?? '不明'}</Typography>
            <AudioControls state={ps} resolver={makeResolver(ps.id)} />
        </Paper>
    ));

    return <AmbienceContainer>{controls}</AmbienceContainer>;
};
