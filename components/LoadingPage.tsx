import { Typography, Box, CircularProgress } from '@material-ui/core';
import Head from 'next/head';
import React, { FC } from 'react';
import styled from 'styled-components';

const LoadingBase = styled.div`
    display: grid;
    min-height: 100vh;
    min-width: 100vw;

    align-content: center;
    align-items: center;

    justify-content: center;
    justify-items: center;
`;

const Inner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const LoadingPage: FC<{ workspace: string }> = ({ workspace }) => {
    return (
        <LoadingBase>
            <Head>
                <title>Audio HQ - {workspace} - Loading...</title>
            </Head>
            <Inner>
                <Typography variant="h2">Audio HQ</Typography>
                <Box mb="5rem" />
                <CircularProgress />
                <Box mt="2rem" />
                <Typography variant="h4">
                    Loading Workspace <strong>{workspace}</strong>...
                </Typography>
            </Inner>
        </LoadingBase>
    );
};

export default LoadingPage;
