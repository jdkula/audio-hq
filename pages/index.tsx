import Head from 'next/head';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Box, CircularProgress, Container, Divider, Hidden, Link, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import React, { KeyboardEvent, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import styled, { createGlobalStyle } from 'styled-components';
import { listen } from 'socket.io';

const GlobalFull = createGlobalStyle`
    html {
        height: 100%;
    }
    body {
        height: 100%;
    }
    #__next {
        height: 100%;
    }
`;

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
`;

export default function Home(): React.ReactElement {
    const router = useRouter();
    const last = router.query.last;

    const [text, setText] = useState('');

    useEffect(() => {
        last && setText(last as string);
    }, [router]);

    const [loading, setLoading] = useState(false);

    const go = (minimal: boolean) => {
        setLoading(true);
        router.push(`/[id]${minimal ? '/minimal' : ''}`, `/${encodeURIComponent(text)}${minimal ? '/minimal' : ''}`);
    };

    const enterListener = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.code === 'Enter') {
            e.preventDefault();
            go(false);
        }
    };

    return (
        <OuterContainer>
            <Head>
                <title>Audio HQ</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <GlobalFull />

            <InnerContainer>
                <Logo>
                    <Hidden xsDown>
                        <Typography variant="h1">Audio HQ</Typography>
                    </Hidden>
                    <Hidden smUp>
                        <Typography variant="h2">Audio HQ</Typography>
                    </Hidden>
                </Logo>
                <TextField
                    style={{ gridArea: 'input' }}
                    id="workspace-input"
                    fullWidth
                    autoFocus
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={enterListener}
                    variant="outlined"
                    label="Workspace Name"
                    disabled={loading}
                />
                {loading ? (
                    <CircularProgress variant="indeterminate" />
                ) : (
                    <Box
                        gridArea="button"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        width="100%"
                        mt="1rem"
                    >
                        <Button fullWidth size="large" variant="contained" color="primary" onClick={() => go(false)}>
                            Join
                        </Button>
                        <Box m="0.5rem" />
                        <Button size="small" variant="outlined" onClick={() => go(true)}>
                            Join Minimal View
                        </Button>
                    </Box>
                )}
            </InnerContainer>
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
