import { makeStyles } from "@material-ui/core";
import { functionalComponent, noProps } from "~/lib/Utility";

const useStyles = makeStyles({
    sfx: {
        gridArea: "sfx",
    },
});

export default functionalComponent(noProps, () => {
    const classes = useStyles();

    return <div className={classes.sfx}>Sound FX</div>;
});
