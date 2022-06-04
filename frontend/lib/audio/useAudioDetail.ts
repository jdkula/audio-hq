/**
 * useAudioDetail.ts
 * ==================
 * Provides a hook that provides audio player data about the piece of
 * audio that's passed in.
 */
import { useCallback, useState } from 'react';
import { Deck_Minimum } from '../urql/graphql_type_helper';
import { usePeriodicEffect } from '../utility/hooks';
import { getTrackInfo } from './util';

interface AudioInfo {
    duration: number;
    volume: number;
    time: number;
    paused: boolean;
    name: string;
    index: number;
}

export default function useAudioDetail(status: Deck_Minimum | null): AudioInfo {
    const [seek, setSeek] = useState(0);

    // TODO useMemo
    const f = status ? getTrackInfo(status) : null;

    const updateData = useCallback(() => {
        const f = status ? getTrackInfo(status) : null;
        if (!f || !status || !status.start_timestamp) {
            return;
        }
        setSeek(f.duration);
    }, [status]);

    usePeriodicEffect(500, updateData);

    return {
        duration: f?.file.length ?? 2,
        paused: !!status?.pause_timestamp,
        time: seek,
        volume: status?.volume ?? 0,
        name: f?.file.name ?? 'Loading...',
        index: f?.index ?? 0,
    };
}
