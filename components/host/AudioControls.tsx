import { PlayState } from "~/lib/Workspace";
import { FunctionComponent, FormEvent, useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import { Seeker } from "../Seeker";

function toTimestamp(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const partialSeconds = Math.floor(seconds % 60);

    return `${minutes}:${partialSeconds.toFixed(0).padStart(2, "0")}`;
}

export const AudioControls: FunctionComponent<{
    state?: PlayState;
    onPlay?: () => void;
    onPause?: () => void;
    onSeek?: (to: number) => void;
}> = (props) => {
    const { state, onPlay, onPause, onSeek } = props;

    const duration = 120;

    if (!state) {
        return <div>Waiting for Audio to Load</div>;
    }

    const finishSeek = (to: number) => {
        onSeek?.(to);
    };

    return (
        <div>
            {state.paused ? (
                <Button variant="outlined" onClick={() => onPlay?.()}>
                    Play
                </Button>
            ) : (
                <Button variant="outlined" onClick={() => onPause?.()}>
                    Pause
                </Button>
            )}

            <Seeker value={state.timestamp ?? 0} min={0} max={duration} step={1} onSeek={finishSeek} />
            {toTimestamp(state.timestamp ?? 0)}
        </div>
    );
};
