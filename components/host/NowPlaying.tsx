import { makeStyles, Button } from '@material-ui/core';
import { createRef, FormEvent, useEffect, useState, FunctionComponent, useContext } from 'react';

import { AudioControls } from './AudioControls';
import { Workspace, WorkspaceState } from '~/lib/Workspace';
import { WorkspaceContext } from '~/pages/workspace/[id]/host';
import { Seeker } from '../Seeker';

const useStyles = makeStyles({
    nowplaying: {
        gridArea: 'nowplaying',
    },
});

export const NowPlaying: FunctionComponent<{
    state: WorkspaceState;
    seek: (to: number) => void;
    volume: (to: number) => void;
    setState: (playing: boolean) => void;
}> = ({ state, seek, volume, setState }) => {
    const classes = useStyles();

    return (
        <div className={classes.nowplaying}>
            <Seeker value={state.playing?.volume ?? 0} min={0} max={1} step={0.01} onSeek={volume} live />
            <AudioControls
                state={state.playing ?? undefined}
                onPause={() => setState(false)}
                onPlay={() => setState(true)}
                onSeek={seek}
            />
            <Button onClick={() => seek(200)}>Seek Test</Button>
        </div>
    );
};
