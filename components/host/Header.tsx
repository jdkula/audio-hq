import { makeStyles, AppBar, Toolbar, Typography, Box, Button, Popover, Slider, IconButton } from '@material-ui/core';
import { globalVolumeAtom, WorkspaceContext } from '~/pages/[id]/host';
import { useContext, FunctionComponent, useState } from 'react';
import { FileManagerContext } from '~/lib/useFileManager';
import Head from 'next/head';
import { VolumeUp, VolumeDown, VolumeMute, VolumeOff } from '@material-ui/icons';
import { useRecoilState } from 'recoil';

const useStyles = makeStyles(() => ({
    header: {
        gridArea: 'header',
    },
}));

export const Header: FunctionComponent = () => {
    const classes = useStyles();
    const workspace = useContext(WorkspaceContext);
    const fileManager = useContext(FileManagerContext);

    const [globalVolume, setGlobalVolume] = useRecoilState(globalVolumeAtom);

    const [volumeOpen, setVolumeOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    let volumeIcon;
    if (globalVolume === 0) {
        volumeIcon = <VolumeOff color="secondary" />;
    } else if (globalVolume < 0.2) {
        volumeIcon = <VolumeMute />;
    } else if (globalVolume < 0.5) {
        volumeIcon = <VolumeDown />;
    } else {
        volumeIcon = <VolumeUp />;
    }

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
                    <Box color="white">
                        <IconButton color="inherit" ref={(r) => setAnchorEl(r)} onClick={() => setVolumeOpen(true)}>
                            {volumeIcon}
                        </IconButton>
                        <Popover
                            open={volumeOpen}
                            onClose={() => setVolumeOpen(false)}
                            anchorEl={anchorEl}
                            anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'center', horizontal: 'right' }}
                        >
                            <Slider
                                min={0}
                                max={1}
                                step={0.05}
                                value={globalVolume}
                                onChange={(_, val) => setGlobalVolume(val as number)}
                                style={{ minWidth: '5rem' }}
                            />
                        </Popover>
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
