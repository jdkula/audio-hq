/**
 * index.tsx
 * ===========
 * Provides AHQ's home page
 */

import Head from 'next/head';
import Button from '@mui/material/Button';
import {
    Box,
    CircularProgress,
    Container,
    FormControl,
    FormControlLabel,
    Hidden,
    Link,
    Radio,
    RadioGroup,
    Switch,
    Tooltip,
    Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { FC, KeyboardEvent, useState } from 'react';

import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import ListHeader from '~/components/ListHeader';
import { Global, css } from '@emotion/react';
import {
    useCreateWorkspaceMutation,
    useWorkspaceDetailByNameQuery,
    useWorkspaceDetailQuery,
} from '~/lib/generated/graphql';
import { useShouldCache } from '~/lib/sw_client';
import { usePeriodicEffect } from '~/lib/utility/hooks';
import { useLocalRecents, useColorMode, ColorMode } from '~/lib/utility/usePersistentData';
import { humanFileSize } from '~/lib/utility/util';

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

interface WorkspaceInfo {
    id: string;
    name: string;
}

const Recent: FC<{ workspaceId: string; onClick: (ws: WorkspaceInfo) => void }> = ({ workspaceId: wsId, onClick }) => {
    const [{ data }] = useWorkspaceDetailQuery({ variables: { workspaceId: wsId } });
    return (
        <Box m="5px">
            <Button
                onClick={() => data?.workspace_by_pk && onClick(data?.workspace_by_pk)}
                variant="outlined"
                disabled={!data?.workspace_by_pk?.name}
            >
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
    const [colorMode, setColorMode] = useColorMode();
    const [shouldCache, setShouldCache] = useShouldCache();
    const [currentlyUsedData, setCurrentlyUsedData] = useState<number | null>(null);

    const [{ fetching, data }, refetch] = useWorkspaceDetailByNameQuery({
        variables: { workspaceName },
        requestPolicy: 'cache-and-network',
    });
    const [, createWorkspaceMutation] = useCreateWorkspaceMutation();

    const foundWorkspace = data?.workspace[0] ?? null;

    usePeriodicEffect(
        2000,
        () => {
            navigator.storage.estimate().then((estimate) => {
                setCurrentlyUsedData(estimate.usage ?? null);
            });
        },
        [shouldCache],
    );

    const createWorkspace = (workspaceName: string) => {
        createWorkspaceMutation({ name: workspaceName }).then((res) => {
            const ws = res.data?.insert_workspace_one;
            if (!ws) return;
            refetch();
            visitWorkspace(ws);
        });
    };

    const visitWorkspace = (ws: WorkspaceInfo | null = foundWorkspace) => {
        if (!ws) {
            if (workspaceName) {
                createWorkspace(workspaceName);
            }
            return;
        }

        setLoading(true);
        setWorkspaceName(ws.name);
        router.push('/workspace', `/workspace/#${encodeURIComponent(ws.id)}`);
    };

    const enterListener = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.code === 'Enter') {
            e.preventDefault();
            visitWorkspace();
        }
    };

    return (
        <OuterContainer>
            <Box sx={{ position: 'fixed', top: 20, left: 20 }}>
                {/* Cache */}
                <FormControlLabel
                    control={<Switch checked={shouldCache} onChange={(_, checked) => setShouldCache(checked)} />}
                    label={
                        <Box>
                            <Typography>NEW! Offline Mode</Typography>
                            <Typography variant="body2">
                                Current usage: {currentlyUsedData ? humanFileSize(currentlyUsedData, true) : '...'}
                            </Typography>
                        </Box>
                    }
                />
            </Box>

            <Head>
                <title>Audio HQ</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <GlobalFull />

            <InnerContainer>
                {/* Logo */}
                <Logo>
                    <Hidden smDown>
                        <Typography variant="h1">Audio HQ</Typography>
                    </Hidden>
                    <Hidden smUp>
                        <Typography variant="h2">Audio HQ</Typography>
                    </Hidden>
                </Logo>

                {/* Join Controls */}
                <TextField
                    id="workspace-input"
                    label="Workspace Name"
                    value={workspaceName}
                    variant="outlined"
                    disabled={loading}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    onKeyDown={enterListener}
                    fullWidth
                    autoFocus
                    style={{ gridArea: 'input' }}
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
                        onClick={() => visitWorkspace()}
                    >
                        {
                            workspaceName
                                ? fetching
                                    ? 'Loading...' // Searching for workspace
                                    : data?.workspace[0]
                                    ? 'Join' // If workspace found
                                    : 'Create Workspace' // If workspace not found
                                : 'Enter a workspace name' // If workspaceName is empty
                        }
                    </Button>
                )}

                {/* Recents */}
                <Box mt="3em" />
                {recents.length > 0 && <ListHeader>Recent Workspaces</ListHeader>}
                <Box mt="1rem" />
                {recents.map((recent) => (
                    <Recent key={recent} workspaceId={recent} onClick={visitWorkspace} />
                ))}
            </InnerContainer>

            {/* Color mode */}
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

            {/* Downloads */}
            <Box m={2}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Box m={2} justifySelf="end" textAlign="center">
                        <Link
                            href="https://s3-us-west-2.amazonaws.com/static-public.jdkula.dev/audiohq/Audio+HQ.dmg"
                            download
                        >
                            Audio HQ for Mac
                        </Link>
                    </Box>
                    <Box justifySelf="center" textAlign="center" color="#888">
                        {'//'}
                    </Box>
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
