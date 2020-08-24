import { makeStyles, Button } from '@material-ui/core';
import { FunctionComponent } from 'react';

import { AudioControls } from './AudioControls';
import { WorkspaceState, PlayStateResolver, PlayState } from '~/lib/Workspace';
import { Seeker } from '../Seeker';

const useStyles = makeStyles({
    nowplaying: {
        gridArea: 'nowplaying',
    },
});

export const NowPlaying: FunctionComponent<{
    state: PlayState;
    resolver: PlayStateResolver;
}> = ({ state, resolver }) => {
    const classes = useStyles();

    return (
        <div className={classes.nowplaying}>
            <AudioControls state={state} resolver={resolver} />
            <Button onClick={() => resolver({ startTimestamp: Date.now() - 200000 })}>Seek Test</Button>
            <Button onClick={() => resolver(null)}>Stop</Button>
        </div>
    );
};
