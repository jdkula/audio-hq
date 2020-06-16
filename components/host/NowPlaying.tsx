import { makeStyles, Button } from "@material-ui/core";
import { createRef, FormEvent } from "react";
import AudioGraph from "~/lib/AudioGraph";
import WorkspaceAdapter from "~/lib/WorkspaceAdapter";

import { functionalComponent } from "~/lib/Utility";

const useStyles = makeStyles({
    nowplaying: {
        gridArea: "nowplaying",
    },
});

export default functionalComponent(
    (PropTypes) => ({
        adapter: PropTypes.instanceOf(WorkspaceAdapter).isRequired,
    }),
    (props) => {
        const classes = useStyles();
        const fileinput = createRef<HTMLInputElement>();

        const onFile = (e: FormEvent<HTMLInputElement>) => {
            const files = (e.target as HTMLInputElement)?.files;
            if (!files) return;

            // can't anymore...
        };

        return (
            <div className={classes.nowplaying}>
                <input type="file" multiple ref={fileinput} onInput={onFile} />
                <Button variant="outlined" onClick={() => props.adapter.updateMain({paused: false})}>
                    Play
                </Button>
                Now Playing!
            </div>
        );
    },
);
