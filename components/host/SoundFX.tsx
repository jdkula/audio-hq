import { makeStyles } from "@material-ui/core";
import { FunctionComponent } from "react";

const useStyles = makeStyles({
    sfx: {
        gridArea: "sfx",
    },
});

export const SoundFX: FunctionComponent = () => {
    const classes = useStyles();

    return <div className={classes.sfx}>Sound FX</div>;
};
