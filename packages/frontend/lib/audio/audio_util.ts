/**
 * audio_util.ts
 * ===============
 * Provides a small set of utility functions used for managing tracks and decks
 */
import { add, differenceInMilliseconds, sub } from 'date-fns';
import { Deck, DeckUpdate, Single } from '@audio-hq/common/src/api/models';

export interface DeckInfo {
    secondsToCurrentPlayhead: number;
    secondsIntoLoop: number;
    totalSeconds: number;
    trackInfo: TrackInfo;
}

interface TrackInfo {
    currentTrack: Single;
    startTime: number;
    endTime: number;
    isCurrent: boolean;
    index: number;
}

export function getDeckInfo(status: Deck, track?: Single): DeckInfo | null {
    const effectiveTime = status.pauseTimestamp ?? new Date();

    const secondsSinceStart = differenceInMilliseconds(effectiveTime, status.startTimestamp) / 1000;
    const totalSeconds = status.queue.reduce((runningTotal, cur) => runningTotal + cur.length / status.speed, 0);
    const secondsIntoLoop = secondsSinceStart % totalSeconds;

    let requestedTrackInfo: TrackInfo | null = null;
    let currentTrackInfo: TrackInfo | null = null;

    // Needs to happen in two passes in order to figure out which file is current
    status.queue.reduce((runningTotal, cur, idx) => {
        const next = runningTotal + cur.length / status.speed;
        const current = runningTotal <= secondsIntoLoop && secondsIntoLoop < next;
        if (cur.id === track?.id) {
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

export function getUnpauseData(state: Deck): DeckUpdate {
    if (!state.pauseTimestamp) throw new Error('We must be paused!');
    return {
        ...state,
        pauseTimestamp: null,
        startTimestamp: add(new Date(state.startTimestamp), {
            seconds: differenceInMilliseconds(new Date(), new Date(state.pauseTimestamp)) / state.speed / 1000,
        }),
    };
}

export function getSpeedChangeData(state: Deck, newSpeed: number): DeckUpdate {
    const effective_now = state.pauseTimestamp ?? new Date();

    return {
        ...state,
        speed: newSpeed,
        startTimestamp: sub(new Date(), {
            seconds:
                (differenceInMilliseconds(effective_now, new Date(state.startTimestamp)) * state.speed) /
                newSpeed /
                1000,
        }),
        pauseTimestamp: state.pauseTimestamp ?? null,
    };
}
