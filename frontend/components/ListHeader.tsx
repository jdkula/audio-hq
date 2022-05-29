import { Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

const ListHeader: FC<{ children?: ReactNode }> = ({ children }) => (
    <div style={{ borderBottom: '1px solid #ddd' }}>
        <Typography variant="overline">{children}</Typography>
    </div>
);

export default ListHeader;
