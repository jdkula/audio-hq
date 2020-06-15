import { makeStyles, AppBar, Toolbar, Typography } from "@material-ui/core";
import { WorkspaceContext } from "~/pages/workspace/[id]/host";
import { useContext } from "react";

const useStyles = makeStyles((theme) => ({
    header: {
        gridArea: "header",
    },
}));

export default function Header(props: {}) {
    const classes = useStyles();
    const workspace = useContext(WorkspaceContext);

    return (
        <AppBar position="relative" className={classes.header}>
            <Toolbar>
                <Typography variant="h6">{workspace ? workspace.name : "Workspace Name"}</Typography>
            </Toolbar>
        </AppBar>
    );
}
