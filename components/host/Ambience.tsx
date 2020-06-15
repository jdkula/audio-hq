import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    ambience: {
        gridArea: "ambience",
    },
});

export default function Ambience(props: {}) {
    const classes = useStyles();

    return <div className={classes.ambience}>Ambience</div>;
}
