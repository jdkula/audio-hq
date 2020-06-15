import { makeStyles, Button } from "@material-ui/core";
import { useContext } from "react";
import { WorkspaceContext } from "~/pages/workspace/[id]/host";

const useStyles = makeStyles({
    explorer: {
        gridArea: "explorer"
    }
});

const propTypes = {

}

export default function Explorer(props: {}) {
    const classes = useStyles();

    const workspace = useContext(WorkspaceContext);

    const doPlay = (fileId) => {
        return () => {
            // TODO: Communicate to <Host /> that we're playing something new.
        };
    };
    
    const fileButtons = workspace?.files.map(file => <Button onClick={doPlay(file.id)} key={file.id}>{file.name}</Button>)

    return <div className={classes.explorer}>
        {fileButtons}
        Explorer!
    </div>;
}

