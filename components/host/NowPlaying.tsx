import { makeStyles, FilledInput } from "@material-ui/core";
import { useContext, createRef, useState } from "react";
import { WorkspaceContext } from "~/pages/workspace/[id]/host";

const useStyles = makeStyles({
    nowplaying: {
        gridArea: "nowplaying"
    }
});

const audio = new AudioContext();

export default function NowPlaying(props) {
    const classes = useStyles();
    const workspace = useContext(WorkspaceContext);

    const fileinput = createRef();

    const [files, setFiles] = useState([]);

    const onFile = e => {
        const files = e.target.files;
        if (!files) return;
        
    }

    return <div className={classes.nowplaying}>
        <input type="file" multiple ref={fileinput} onInput={onFile} />
        Now Playing!
    </div>;
}