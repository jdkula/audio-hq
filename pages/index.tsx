import Head from 'next/head';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';

import Router, { useRouter } from 'next/router';
import styled from 'styled-components';
import Link from 'next/link';

const InnerContainer = styled.main`
    display: grid;
    grid-template-columns: 20% 60% 20%;
    grid-template-rows: 30% 70%;
    grid-template-areas:
        'logo logo logo'
        '. portal .';
    min-height: 100vh;
    padding: 15%;
`;

const Logo = styled.div`
    grid-area: logo;
    text-align: center;
`;

const Portal = styled.div`
    grid-area: portal;
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: 30% 30% 40%;
    grid-template-areas:
        'input input'
        'button  button '
        '.     .';
    padding: 25% 10%;
    column-gap: 20px;
    row-gap: 10px;
`;

export default function Home(): React.ReactElement {
    const [text, setText] = useState('');
    const router = useRouter();

    return (
        <Container>
            <Head>
                <title>Audio HQ</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <InnerContainer>
                <Logo>
                    <Typography variant="h1">Audio HQ</Typography>
                </Logo>
                <Portal>
                    <TextField
                        style={{ gridArea: 'input' }}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        variant="outlined"
                        label="Workspace Name"
                    />
                    <Link href="/[id]/host">
                        <Button
                            style={{ gridArea: 'button' }}
                            variant="contained"
                            color="primary"
                            onClick={() => router.push(`/${text}/host`)}
                        >
                            Join
                        </Button>
                    </Link>
                </Portal>
            </InnerContainer>
        </Container>
    );
}
