import { makeStyles, AppBar, Toolbar, Typography } from '@material-ui/core';
import { WorkspaceContext } from '~/pages/[id]/host';
import { useContext, FunctionComponent } from 'react';

const useStyles = makeStyles(() => ({
    header: {
        gridArea: 'header',
    },
}));

export const Header: FunctionComponent = () => {
    const classes = useStyles();
    const workspace = useContext(WorkspaceContext);

    return (
        <AppBar position="relative" className={classes.header}>
            <Toolbar>
                <Typography variant="h6">{workspace ? workspace.name : 'Workspace Name'}</Typography>
            </Toolbar>
        </AppBar>
    );
};
