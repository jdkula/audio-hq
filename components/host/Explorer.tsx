import { makeStyles, Button } from "@material-ui/core";
import { useContext } from "react";
import { WorkspaceContext } from "~/pages/workspace/[id]/host";
import PropTypes from "prop-types";

const useStyles = makeStyles({
    explorer: {
        gridArea: "explorer",
    },
});

const propTypes = {
    setSong: PropTypes.func.isRequired,
};

export default function Explorer(props: PropTypes.InferProps<typeof propTypes>): React.ReactElement {
    const classes = useStyles();

    const workspace = useContext(WorkspaceContext);

    const doPlay = (fileId: string) => {
        return () => {
            props.setSong(fileId);
        };
    };

    const fileButtons = workspace?.files.map((file) => (
        <Button onClick={doPlay(file.id)} key={file.id}>
            {file.name}
        </Button>
    ));

    return (
        <div className={classes.explorer}>
            {fileButtons}
            Explorer!
        </div>
    );
}

Explorer.propTypes = propTypes;
