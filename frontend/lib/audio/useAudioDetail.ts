/**
 * useAudioDetail.ts
 * ==================
 * Provides a hook that provides audio player data about the piece of
 * audio that's passed in.
 */
import { useCallback, useMemo, useState } from 'react';
import { Deck_Type_Enum_Enum } from '../generated/graphql';
import { Deck_Minimum } from '../urql/graphql_type_helper';
import { usePeriodicEffect } from '../utility/hooks';
import { isDefined } from '../utility/util';
import { getDeckInfo } from './audio_util';

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

    const data = useMemo(() => (!isDefined(status) ? null : getDeckInfo(status)), [status]);

    const updateData = useCallback(() => {
        if (!status) return;
        const currentData = getDeckInfo(status);
        if (!currentData) return;

        if (status.type === Deck_Type_Enum_Enum.Sfx) {
            setSeek(
                Math.min(
                    currentData.secondsToCurrentPlayhead * status.speed,
                    currentData.trackInfo.currentTrack.file.length,
                ),
            );
            return;
        }

        setSeek((currentData.secondsIntoLoop - currentData.trackInfo.startTime) * status.speed);
    }, [status]);

    usePeriodicEffect(500, updateData);

    let appearPaused = !!status?.pause_timestamp;
    if (data && status?.type === Deck_Type_Enum_Enum.Sfx) {
        appearPaused ||= data.secondsToCurrentPlayhead * status.speed > data.trackInfo.currentTrack.file.length;
    }

    return {
        duration: data?.trackInfo.currentTrack.file.length ?? 1,
        paused: appearPaused,
        time: seek,
        volume: status?.volume ?? 0,
        name: data?.trackInfo.currentTrack.file.name ?? 'Loading...',
        index: data?.trackInfo.index ?? 0,
    };
}
