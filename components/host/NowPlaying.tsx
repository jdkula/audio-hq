import { makeStyles, Button } from "@material-ui/core";
import { createRef, FormEvent } from "react";
import AudioGraph from "~/lib/AudioGraph";
import PropTypes from "prop-types";

const useStyles = makeStyles({
    nowplaying: {
        gridArea: "nowplaying",
    },
});

const propTypes = {
    graph: PropTypes.instanceOf(AudioGraph).isRequired,
};

export default function NowPlaying(props: PropTypes.InferProps<typeof propTypes>): React.ReactElement {
    const classes = useStyles();
    const fileinput = createRef<HTMLInputElement>();

    const onFile = (e: FormEvent<HTMLInputElement>) => {
        const files = (e.target as HTMLInputElement)?.files;
        if (!files) return;

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

NowPlaying.propTypes = propTypes;
