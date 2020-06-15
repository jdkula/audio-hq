import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    sfx: {
        gridArea: "sfx"
    }
});

export default function SoundFX(props: {}) {
    const classes = useStyles();

    return <div className={classes.sfx}>Sound FX</div>;
}