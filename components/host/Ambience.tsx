import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    ambience: {
        gridArea: "ambience",
    },
});

export default function Ambience(): React.ReactElement {
    const classes = useStyles();

    return <div className={classes.ambience}>Ambience</div>;
}
