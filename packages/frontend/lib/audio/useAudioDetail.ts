/**
 * useAudioDetail.ts
 * ==================
 * Provides a hook that provides audio player data about the piece of
 * audio that's passed in.
 */
import { useCallback, useState } from 'react';
import { usePeriodicEffect } from '../utility/hooks';
import { getDeckInfo } from './audio_util';
import * as API from 'common/src/api/models';

interface AudioInfo {
    duration: number;
    volume: number;
    time: number;
    paused: boolean;
    name: string;
    index: number;
}

export default function useAudioDetail(status: API.Deck | null): AudioInfo {
    const [seek, setSeek] = useState(0);

    const data = status ? getDeckInfo(status) : null;

    const updateData = useCallback(() => {
        if (!status) return;
        const currentData = getDeckInfo(status);
        if (!currentData) return;

        if (status.type === 'sfx') {
            setSeek(
                Math.min(
                    currentData.secondsToCurrentPlayhead * status.speed,
                    currentData.trackInfo.currentTrack.length,
                ),
            );
            return;
        }

        setSeek((currentData.secondsIntoLoop - currentData.trackInfo.startTime) * status.speed);
    }, [status]);

    usePeriodicEffect(500, updateData);

    let appearPaused = !!status?.pauseTimestamp;
    if (data && status?.type === 'sfx') {
        appearPaused ||= data.secondsToCurrentPlayhead * status.speed > data.trackInfo.currentTrack.length;
    }

    return {
        duration: data?.trackInfo.currentTrack.length ?? 1,
        paused: appearPaused,
        time: seek,
        volume: status?.volume ?? 0,
        name: data?.trackInfo.currentTrack.name ?? 'Loading...',
        index: data?.trackInfo.index ?? 0,
    };
}
