import { makeStyles } from '@material-ui/core';
import { FunctionComponent } from 'react';

const useStyles = makeStyles({
    ambience: {
        gridArea: 'ambience',
    },
});

export const Ambience: FunctionComponent = () => {
    const classes = useStyles();

    return <div className={classes.ambience}>Ambience</div>;
};
