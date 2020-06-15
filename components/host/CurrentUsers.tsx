import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    users: {
        gridArea: "users",
    },
});

export default function CurrentUsers(): React.ReactElement {
    const classes = useStyles();

    return <div className={classes.users}>Current Users</div>;
}
