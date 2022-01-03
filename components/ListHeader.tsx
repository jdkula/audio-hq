import { Typography } from '@mui/material';
import { FC } from 'react';
import styled from '@emotion/styled';

const ListHeader: FC = ({ children }) => (
    <div style={{ borderBottom: '1px solid #ddd' }}>
        <Typography variant="overline">{children}</Typography>
    </div>
);

export default ListHeader;
