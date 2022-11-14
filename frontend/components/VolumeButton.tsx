/**
 * VolumeButton.tsx
 * =================
 * PProvides a volume icon that reacts to changes in the volume.
 */

import React, { FC } from 'react';
import { VolumeDown, VolumeMute, VolumeOff, VolumeUp } from '@mui/icons-material';

const VolumeButton: FC<{ volume: number }> = ({ volume }) => {
    let volumeIcon;
    if (volume === 0) {
        volumeIcon = <VolumeOff color="error" />;
    } else if (volume < 0.2) {
        volumeIcon = <VolumeMute />;
    } else if (volume < 0.5) {
        volumeIcon = <VolumeDown />;
    } else {
        volumeIcon = <VolumeUp />;
    }

    return volumeIcon;
};

export default VolumeButton;
