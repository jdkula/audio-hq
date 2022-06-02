import Head from 'next/head';
import Button from '@mui/material/Button';
import {
    Box,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    Hidden,
    Link,
    Radio,
    RadioGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { FC, KeyboardEvent, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import PouchDB from 'pouchdb';
import ListHeader from '~/components/ListHeader';
import { Global, css } from '@emotion/react';
import { ColorMode, useColorMode, useLocalRecents } from '../lib/utility';
import { useWorkspaceDetailByNameQuery, useWorkspaceDetailQuery } from '~/lib/generated/graphql';

const GlobalFull = () => (
    <Global
        styles={css`
            html {
                height: 100%;
            }
            body {
                height: 100%;
            }
            #__next {
                height: 100%;
            }
        `}
    />
);

const OuterContainer = styled(Container)`
    height: 100%;
    width: 100%;
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-rows: 1fr auto;
`;

const InnerContainer = styled.main`
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto 1fr 1fr;
    grid-template-areas:
        'logo'
        'input'
        'button';
    width: 100%;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
`;

const Logo = styled.div`
    grid-area: logo;
    margin-bottom: 5rem;
    text-align: center;
    cursor: pointer;
    user-select: none;
`;

// thanks https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string/10420404 !
function humanFileSize(bytes: number, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
}

const ConfirmDeleteAllDialog: FC<DialogProps> = (props) => {
    const [deleting, setDeleting] = useState(false);

    const [size, setSize] = useState<number | null>(null);

    useEffect(() => {
        if (props.open) {
            new PouchDB('cache')
                .allDocs({ attachments: true, binary: true, include_docs: true })
                .then((docs) => docs.rows.flatMap((doc) => Object.values(doc.doc?._attachments ?? {})))
                .then((attachments) =>
                    attachments.map((attachment) => ((attachment as PouchDB.Core.FullAttachment).data as Blob).size),
                )
                .then((sizes) => sizes.reduce((sum, cur) => sum + cur, 0))
                .then((totalSize) => setSize(totalSize));
        }
    }, [props.open]);

    const doDelete = () => {
        setDeleting(true);
        new PouchDB('cache').destroy().then(() => window.location.reload());
    };

    return (
        <Dialog {...props}>
            <DialogTitle>Clear Audio Cache</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1">
                    Are you sure? This will completely clear all stored music, meaning you&apos;ll have to download
                    everything from scratch!
                </Typography>
                <Box m="1rem" />
                <Typography variant="button">
                    Total Size: {size === null ? 'Calculating...' : humanFileSize(size, true)}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose?.({}, 'escapeKeyDown')}>Cancel</Button>
                {deleting ? (
                    <CircularProgress />
                ) : (
                    <Button onClick={doDelete} color="secondary">
                        Delete
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

const Recent: FC<{ wsId: string; onClick: () => void }> = ({ wsId, onClick }) => {
    const [{ data }] = useWorkspaceDetailQuery({ variables: { workspaceId: wsId } });
    return (
        <Box m="5px">
            <Button onClick={onClick} variant="outlined" disabled={!data?.workspace_by_pk?.name}>
                {data?.workspace_by_pk?.name ?? <CircularProgress color="inherit" size="1rem" />}
            </Button>
        </Box>
    );
};

export default function Home(): React.ReactElement {
    const router = useRouter();
    const [recents] = useLocalRecents();

    const [workspaceName, setWorkspaceName] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [colorMode, setColorMode] = useColorMode();

    const [{ fetching, data }] = useWorkspaceDetailByNameQuery({ variables: { workspaceName } });

    const go = (wsId = data?.workspace[0].id) => {
        if (!wsId) return;

        setLoading(true);
        setWorkspaceName(wsId);
        router.push('/workspace', `/workspace/#${encodeURIComponent(wsId)}`);
    };

    const enterListener = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.code === 'Enter') {
            e.preventDefault();
            go();
        }
    };

    return (
        <OuterContainer>
            <ConfirmDeleteAllDialog onClose={() => setDeleting(false)} open={deleting} />
            <Head>
                <title>Audio HQ</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <GlobalFull />

            <InnerContainer>
                <Tooltip placement="top" arrow title="Double-click/tap to delete audio cache" enterDelay={500}>
                    <Logo onDoubleClick={() => setDeleting(true)}>
                        <Hidden smDown>
                            <Typography variant="h1">Audio HQ</Typography>
                        </Hidden>
                        <Hidden smUp>
                            <Typography variant="h2">Audio HQ</Typography>
                        </Hidden>
                    </Logo>
                </Tooltip>
                <TextField
                    style={{ gridArea: 'input' }}
                    id="workspace-input"
                    fullWidth
                    autoFocus
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    onKeyDown={enterListener}
                    variant="outlined"
                    label="Workspace Name"
                    disabled={loading}
                />
                {loading ? (
                    <CircularProgress variant="indeterminate" />
                ) : (
                    <Button
                        fullWidth
                        disabled={!workspaceName || fetching}
                        size="large"
                        variant="contained"
                        color={data?.workspace[0] ? 'primary' : 'secondary'}
                        onClick={() => go()}
                    >
                        {workspaceName
                            ? fetching
                                ? 'Loading...'
                                : data?.workspace[0]
                                ? 'Join'
                                : 'Create Workspace'
                            : 'Enter a workspace name'}
                    </Button>
                )}
                <Box mt="3em" />
                {recents.length > 0 && <ListHeader>Recent Workspaces</ListHeader>}
                <Box mt="1rem" />
                {recents.map((recent) => (
                    <Recent key={recent} wsId={recent} onClick={() => go(recent)} />
                ))}
            </InnerContainer>
            <Tooltip arrow placement="top" title="Press Alt/Option+M at any time to toggle light and dark modes">
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    textAlign="center"
                >
                    <ListHeader>Color Mode</ListHeader>
                    <Box my="0.5rem" />
                    <FormControl component="fieldset">
                        <RadioGroup
                            row
                            aria-label="color"
                            name="row-radio-buttons-group"
                            value={colorMode}
                            onChange={(_, mode) => setColorMode(mode as ColorMode)}
                        >
                            <FormControlLabel value="auto" control={<Radio />} label="Auto" labelPlacement="top" />
                            <FormControlLabel value="light" control={<Radio />} label="Light" labelPlacement="top" />
                            <FormControlLabel value="dark" control={<Radio />} label="Dark" labelPlacement="top" />
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Tooltip>

            <Box m={2}>
                <Box display="grid" gridTemplateColumns="1fr auto 1fr" gridTemplateRows="auto" alignItems="center">
                    <Box m={2} justifySelf="end" textAlign="center">
                        <Link
                            href="https://s3-us-west-2.amazonaws.com/static-public.jdkula.dev/audiohq/Audio+HQ.dmg"
                            download
                        >
                            Audio HQ for Mac
                        </Link>
                    </Box>
                    <Divider flexItem variant="middle" orientation="vertical" />
                    <Box m={2} justifySelf="start" textAlign="center">
                        <Link
                            href="https://s3-us-west-2.amazonaws.com/static-public.jdkula.dev/audiohq/Audio+HQ.zip"
                            download
                        >
                            Audio HQ for Windows
                        </Link>
                    </Box>
                </Box>
            </Box>
        </OuterContainer>
    );
}
