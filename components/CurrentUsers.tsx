import { makeStyles } from '@material-ui/core';
import { FunctionComponent } from 'react';

const useStyles = makeStyles({
    users: {
        gridArea: 'users',
    },
});

export const CurrentUsers: FunctionComponent = () => {
    const classes = useStyles();

    return <div className={classes.users}>Current Users</div>;
};
