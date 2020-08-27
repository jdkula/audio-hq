import Head from 'next/head';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { KeyboardEvent, useState } from 'react';

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
    justify-items: stretch;
`;

const Logo = styled.div`
    grid-area: logo;
    margin-bottom: 5rem;
    text-align: center;
`;

export default function Home(): React.ReactElement {
    const [text, setText] = useState('');
    const router = useRouter();

    const go = () => {
        router.push('/[id]', `/${encodeURIComponent(text)}`);
    };

    const enterListener = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.code === 'Enter') {
            e.preventDefault();
            go();
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
                    <Typography variant="h1">Audio HQ</Typography>
                </Logo>
                <TextField
                    style={{ gridArea: 'input' }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={enterListener}
                    variant="outlined"
                    label="Workspace Name"
                />
                <Button
                    style={{ gridArea: 'button' }}
                    fullWidth
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={go}
                >
                    Join
                </Button>
            </InnerContainer>
        </OuterContainer>
    );
}
