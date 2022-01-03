import { Typography } from '@material-ui/core';
import { FC } from 'react';
import styled from 'styled-components';

const ListHeader: FC = ({ children }) => (
    <div style={{ borderBottom: '1px solid #ddd' }}>
        <Typography variant="overline">{children}</Typography>
    </div>
);

export default ListHeader;
