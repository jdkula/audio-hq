/**
 * audio_util.ts
 * ===============
 * Provides a small set of utility functions used for managing tracks and decks
 */
import { add, differenceInMilliseconds, sub } from 'date-fns';
import { Deck_Minimum, Track_Minimum } from '../urql/graphql_type_helper';

interface DeckInfo {
    secondsToCurrentPlayhead: number;
    secondsIntoLoop: number;
    totalSeconds: number;
    trackInfo: TrackInfo;
}

interface TrackInfo {
    currentTrack: Track_Minimum;
    startTime: number;
    endTime: number;
    isCurrent: boolean;
    index: number;
}

export function getDeckInfo(status: Deck_Minimum, track?: Track_Minimum): DeckInfo | null {
    const effectiveTime = status.pause_timestamp ? new Date(status.pause_timestamp) : new Date();

    const secondsSinceStart = differenceInMilliseconds(effectiveTime, new Date(status.start_timestamp)) / 1000;
    const totalSeconds = status.queue.reduce((runningTotal, cur) => runningTotal + cur.file.length / status.speed, 0);
    const secondsIntoLoop = secondsSinceStart % totalSeconds;

    let requestedTrackInfo: TrackInfo | null = null;
    let currentTrackInfo: TrackInfo | null = null;

    // Needs to happen in two passes in order to figure out which file is current
    status.queue.reduce((runningTotal, cur, idx) => {
        const next = runningTotal + cur.file.length / status.speed;
        const current = runningTotal <= secondsIntoLoop && secondsIntoLoop < next;
        if (cur.file.id === track?.file.id) {
            requestedTrackInfo = {
                currentTrack: track,
                startTime: runningTotal,
                endTime: next,
                isCurrent: current,
                index: idx,
            };
        }
        if (current) {
            currentTrackInfo = {
                currentTrack: cur,
                startTime: runningTotal,
                endTime: next,
                isCurrent: true,
                index: idx,
            };
        }

        return next;
    }, 0);

    const trackInfo = track ? requestedTrackInfo : currentTrackInfo;

    if (!trackInfo) {
        return null;
    }

    return {
        secondsToCurrentPlayhead: secondsSinceStart,
        secondsIntoLoop,
        totalSeconds,
        trackInfo,
    };
}

export function getUnpauseData(state: Deck_Minimum): Partial<Deck_Minimum> {
    if (!state.pause_timestamp) throw new Error('We must be paused!');
    return {
        pause_timestamp: null,
        start_timestamp: add(new Date(state.start_timestamp), {
            seconds: differenceInMilliseconds(new Date(), new Date(state.pause_timestamp)) / state.speed / 1000,
        }).toISOString(),
    };
}

export function getSpeedChangeData(state: Deck_Minimum, newSpeed: number): Partial<Deck_Minimum> {
    const effective_now = state.pause_timestamp ? new Date(state.pause_timestamp) : new Date();

    return {
        speed: newSpeed,
        start_timestamp: sub(new Date(), {
            seconds:
                (differenceInMilliseconds(effective_now, new Date(state.start_timestamp)) * state.speed) /
                newSpeed /
                1000,
        }).toISOString(),
        pause_timestamp: state.pause_timestamp ? new Date().toISOString() : null,
    };
}
