import {
    makeStyles,
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Popover,
    Slider,
    IconButton,
    Tooltip,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import { globalVolumeAtom, WorkspaceContext } from '~/pages/[id]';
import { useContext, FunctionComponent, useState, FC, useRef } from 'react';
import { FileManagerContext } from '~/lib/useFileManager';
import Head from 'next/head';
import { VolumeUp, VolumeDown, VolumeMute, VolumeOff } from '@material-ui/icons';
import { useRecoilState } from 'recoil';

import DeleteIcon from '@material-ui/icons/DeleteSweep';
import { useRouter } from 'next/router';

export const VolumeButton: FC<{ volume: number }> = ({ volume }) => {
    let volumeIcon;
    if (volume === 0) {
        volumeIcon = <VolumeOff color="secondary" />;
    } else if (volume < 0.2) {
        volumeIcon = <VolumeMute />;
    } else if (volume < 0.5) {
        volumeIcon = <VolumeDown />;
    } else {
        volumeIcon = <VolumeUp />;
    }

    return volumeIcon;
};

export const Header: FunctionComponent<{ host?: boolean }> = ({ host }) => {
    const workspace = useContext(WorkspaceContext);
    const fileManager = useContext(FileManagerContext);
    const router = useRouter();

    const [globalVolume, setGlobalVolume] = useRecoilState(globalVolumeAtom);

    const [volumeOpen, setVolumeOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const onReset = () => fileManager.reset().then(() => window.location.reload());

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppBar position="static" style={{ gridArea: 'header' }}>
            <Head>
                <title>
                    Audio HQ – {workspace ? workspace.name : 'Loading...'}
                    {!host ? ' – Micro View' : ''}
                </title>
            </Head>
            <Toolbar>
                <Box display="flex" width="100%" alignItems="center">
                    <Box flexGrow="1" display="flex" alignItems="center">
                        <Typography
                            variant={isSmall ? 'h5' : 'h4'}
                            style={{ cursor: 'pointer' }}
                            onClick={() => router.push('/')}
                        >
                            Audio HQ – {workspace ? workspace.name : 'Loading...'}
                        </Typography>
                        {!isSmall && !host && (
                            <Box px={4}>
                                <Typography variant="subtitle1">Micro View</Typography>
                            </Box>
                        )}
                    </Box>
                    {host && (
                        <Box color="white" display="flex" alignItems="center">
                            <Typography variant="body1">Your Volume Controls</Typography>
                            <Tooltip title="Your Volume" placement="bottom" arrow>
                                <IconButton
                                    color="inherit"
                                    ref={(r) => setAnchorEl(r)}
                                    onClick={() => setVolumeOpen(true)}
                                >
                                    <VolumeButton volume={globalVolume} />
                                </IconButton>
                            </Tooltip>
                            <Popover
                                open={volumeOpen}
                                onClose={() => setVolumeOpen(false)}
                                anchorEl={anchorEl}
                                anchorOrigin={{ vertical: 'center', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'center', horizontal: 'right' }}
                            >
                                <Box mx="1rem" my="0.25rem" minWidth="10rem">
                                    <Slider
                                        min={0}
                                        max={1}
                                        step={0.01}
                                        value={globalVolume}
                                        onChange={(_, val) => setGlobalVolume(val as number)}
                                    />
                                </Box>
                            </Popover>
                        </Box>
                    )}
                    {!isSmall && (
                        <Box color="white">
                            <Tooltip placement="bottom" title="Clear entire cache (double click/tap to activate)" arrow>
                                <IconButton color="inherit" onDoubleClick={onReset}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};
