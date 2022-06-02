import { Box, Button, CircularProgress, Typography } from '@mui/material';
import Head from 'next/head';
import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Add, ArrowBack, Undo } from '@mui/icons-material';
import { useCreateWorkspaceMutation } from '~/lib/generated/graphql';

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

const WorkspaceNotFound: FC<{ workspace: string }> = ({ workspace }) => {
    return (
        <LoadingBase>
            <Head>
                <title>Audio HQ - 404</title>
            </Head>
            <Inner>
                <Typography variant="h2">Audio HQ</Typography>
                <Box mb="5rem" />
                <CircularProgress variant="determinate" value={100} />
                <Box mt="2rem" />
                <Typography variant="h4">That workspace couldn’t be found.</Typography>
                <Typography variant="h5">
                    Would you like to{' '}
                    <Button
                        variant="outlined"
                        sx={{ margin: 1 }}
                        startIcon={<ArrowBack />}
                        color="primary"
                        onClick={() => (window.location.href = '/')}
                    >
                        try again
                    </Button>{' '}
                    ?
                </Typography>
            </Inner>
        </LoadingBase>
    );
};

export default WorkspaceNotFound;
