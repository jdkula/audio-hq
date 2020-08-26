import { makeStyles, AppBar, Toolbar, Typography, Box, Button } from '@material-ui/core';
import { WorkspaceContext } from '~/pages/[id]/host';
import { useContext, FunctionComponent } from 'react';
import { FileManagerContext } from '~/lib/useFileManager';
import Head from 'next/head';

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
            <Head>
                <title>Audio HQ – {workspace ? workspace.name : 'Loading...'} – Host View</title>
            </Head>
            <Toolbar>
                <Box display="flex" width="100%" alignItems="center">
                    <Box flexGrow="1" display="flex" alignItems="center">
                        <Typography variant="h4">Audio HQ – {workspace ? workspace.name : 'Loading...'}</Typography>
                        <Box px={4}>
                            <Typography variant="subtitle1">Host View</Typography>
                        </Box>
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
