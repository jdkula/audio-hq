import { makeStyles, Button } from "@material-ui/core";
import { createRef, FormEvent, useEffect, useState, FunctionComponent, useContext } from "react";
import { WorkspaceAdapter } from "~/lib/WorkspaceAdapter";

import { AudioControls } from "./AudioControls";
import { Workspace } from "~/lib/Workspace";
import { WorkspaceContext } from "~/pages/workspace/[id]/host";
import { Seeker } from "../Seeker";

const useStyles = makeStyles({
    nowplaying: {
        gridArea: "nowplaying",
    },
});

export const NowPlaying: FunctionComponent<{
    adapter: WorkspaceAdapter;
}> = (props) => {
    const classes = useStyles();

    const workspace = useContext(WorkspaceContext);

    const updateSeek = (to: number) => {
        props.adapter.updateMain({
            timestamp: to,
        });
        // TODO: On mouse up, actually send update.
    };

    const updateVol = (to: number) => {
        props.adapter.updateMain({
            volume: to,
        });
    }

    return (
        <div className={classes.nowplaying}>
            <Seeker value={workspace?.state.playing?.volume ?? 0} min={0} max={1} step={0.01} onSeek={updateVol} live />
            <AudioControls
                adapter={props.adapter}
                state={workspace?.state.playing ?? undefined}
                onPause={() => props.adapter.updateMain({ paused: true })}
                onPlay={() => props.adapter.updateMain({ paused: false })}
                onSeek={updateSeek}
            />
            <Button onClick={() => props.adapter.graph.main.player(0)?.seek(200)}>Seek Test</Button>
        </div>
    );
};
