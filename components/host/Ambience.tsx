import { makeStyles } from "@material-ui/core";
import { noProps, functionalComponent } from "~/lib/Utility";

const useStyles = makeStyles({
    ambience: {
        gridArea: "ambience",
    },
});

export default functionalComponent(noProps, () => {
    const classes = useStyles();

    return <div className={classes.ambience}>Ambience</div>;
});
