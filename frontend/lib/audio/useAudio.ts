import { useCallback, useEffect, useState } from 'react';
import { getTrackInfo, usePeriodicEffect } from '../utility';
import { Play_Status } from '../generated/graphql';
import { Play_Status_Minimum } from '../graphql_type_helper';

interface AudioInfo {
    duration: number;
    volume: number;
    time: number;
    paused: boolean;
    name: string;
    index: number;
}

const useAudio = (status: Play_Status_Minimum | null): AudioInfo => {
    const [seek, setSeek] = useState(0);

    const f = status ? getTrackInfo(status) : null;

    const updateData = useCallback(() => {
        const f = status ? getTrackInfo(status) : null;
        if (!f || !status || !status.start_timestamp) {
            return;
        }
        setSeek(f.duration);
    }, [status]);

    useEffect(() => {
        const info = status ? getTrackInfo(status) : null;
        if (info) {
            const remaining = info.file.length - info.duration;
            const handle = setTimeout(updateData, remaining * 1000);
            return () => {
                clearTimeout(handle);
            };
        }
    }, [status, updateData]);

    return {
        duration: f?.file.length ?? 2,
        paused: !!status?.pause_timestamp,
        time: seek,
        volume: status?.volume ?? 0,
        name: f?.file.name ?? 'Loading...',
        index: f?.index ?? 0,
    };
};

export default useAudio;
