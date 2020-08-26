import { makeStyles, AppBar, Toolbar, Typography, Box, Button } from '@material-ui/core';
import { WorkspaceContext } from '~/pages/[id]/host';
import { useContext, FunctionComponent } from 'react';
import { FileManagerContext } from '~/lib/useFileManager';

const useStyles = makeStyles(() => ({
    header: {
        gridArea: 'header',
    },
}));

export const Header: FunctionComponent = () => {
    const classes = useStyles();
    const workspace = useContext(WorkspaceContext);
    const fileManager = useContext(FileManagerContext);

    return (
        <AppBar position="relative" className={classes.header}>
            <Toolbar>
                <Box display="flex" width="100%">
                    <Box flexGrow="1">
                        <Typography variant="h6">{workspace ? workspace.name : 'Workspace Name'}</Typography>
                    </Box>
                    <Box color="#bbb">
                        <Button variant="outlined" color="inherit" onClick={() => fileManager.reset()}>
                            Clear File Cache
                        </Button>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
