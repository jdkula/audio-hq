import { makeStyles, FilledInput, Button } from "@material-ui/core";
import { useContext, createRef, useState } from "react";
import { WorkspaceContext } from "~/pages/workspace/[id]/host";
import AudioGraph from "~/lib/AudioGraph";

const useStyles = makeStyles({
    nowplaying: {
        gridArea: "nowplaying",
    },
});

export default function NowPlaying(props: { graph: AudioGraph }) {
    const classes = useStyles();
    const workspace = useContext(WorkspaceContext);

    const fileinput = createRef<HTMLInputElement>();

    const [files, setFiles] = useState([]);

    const onFile = (e: any) => {
        const files = e.target.files;
        if (!files) return;

        setFiles(files);
        props.graph.playMain(files);
    };

    return (
        <div className={classes.nowplaying}>
            <input type="file" multiple ref={fileinput} onInput={onFile} />
            <Button variant="outlined" onClick={() => props.graph.main.resume()}>
                Play
            </Button>
            Now Playing!
        </div>
    );
}
