import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    explorer: {
        gridArea: "explorer"
    }
});

export default function Explorer(props) {
    const classes = useStyles();

    return <div className={classes.explorer}>Explorer</div>;
}