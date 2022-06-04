/**
 * CircularProgressWithLabel.tsx
 * ==============================
 * From the CircularProgress MUI documentation.
 * Displays a percentage inside a circular progress indicator.
 */

import { Box, CircularProgress, CircularProgressProps, Typography, TypographyProps } from '@mui/material';
import React, { FC, forwardRef } from 'react';

const CircularProgressWithLabel: FC<CircularProgressProps & { textColor?: TypographyProps['color'] }> = forwardRef(
    ({ textColor, ...props }, ref) =>
        props.value !== undefined ? (
            <Box position="relative" display="inline-flex">
                <CircularProgress {...props} ref={ref} />
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography variant="caption" component="div" color={textColor || 'textSecondary'}>{`${Math.round(
                        props.value,
                    )}%`}</Typography>
                </Box>
            </Box>
        ) : (
            <CircularProgress ref={ref} {...props} />
        ),
);
CircularProgressWithLabel.displayName = 'CircularProgressWithLabel';

export default CircularProgressWithLabel;
