/**
 * audio/util.ts
 * ===============
 * Provides a small set of utility functions used for managing tracks and decks
 */
import { differenceInMilliseconds, getUnixTime } from 'date-fns';
import { File_Minimum, Deck_Minimum } from '../urql/graphql_type_helper';
import { isDefined } from '../utility/util';

interface CurrentFileInfo {
    file: File_Minimum;
    index: number;
    duration: number; // in s
    totalTimeBefore: number; // in s
}

export function getTrackInfo(status: Deck_Minimum, idx?: number): CurrentFileInfo | null {
    // debugger;
    const files = status.queue.map((x) => x.file).filter(isDefined);

    if (status.start_timestamp === null) {
        return null;
    }

    const totalTime = files.reduce((prev, cur) => prev + cur.length, 0); // in seconds
    const curTs = getUnixTime(status.pause_timestamp ? new Date(status.pause_timestamp) : new Date());
    const curDuration = ((curTs - getUnixTime(new Date(status.start_timestamp))) * status.speed) % totalTime; // in seconds
    let elapsed = 0;

    if (idx !== undefined) {
        if (idx < 0) return null;
        idx %= files.length;

        const totalTimeBefore = files.slice(0, idx).reduce((sum, f) => sum + f.length, 0); // in seconds
        const duration = curDuration - totalTimeBefore;
        return { file: files[idx], duration: duration, totalTimeBefore, index: idx };
    }

    // TODO: If no index identified, find the currently playing one.
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const prevElapsed = elapsed;
        elapsed += file.length;
        if (curDuration < elapsed) {
            const duration = curDuration - prevElapsed;
            return { file, duration, totalTimeBefore: prevElapsed, index: i };
        }
    }

    return null;
}

interface AudioTimes {
    startTime: number;
    endTime: number;
    secondsIntoLoop: number;
    totalSeconds: number;
    myTurn: boolean;
}

export function getTimes(status: Deck_Minimum): Pick<AudioTimes, 'totalSeconds' | 'secondsIntoLoop'>;
export function getTimes(status: Deck_Minimum, currentQueueEntryId: string): AudioTimes;
export function getTimes(status: Deck_Minimum, currentQueueEntryId?: string): Partial<AudioTimes> {
    // TODO: Keep track of speed, too.
    const secondsSinceStart = differenceInMilliseconds(new Date(), new Date(status.start_timestamp)) / 1000;
    let startTime = 0;
    let endTime = 0;
    let found = false;
    const totalSeconds = status.queue.reduce((prev, cur) => {
        if (cur.id === currentQueueEntryId) {
            found = true;
            startTime = prev;
            endTime = prev + cur.file.length / status.speed;
        }
        return prev + cur.file.length / status.speed;
    }, 0);

    const secondsIntoLoop = secondsSinceStart % totalSeconds;

    if (!currentQueueEntryId) {
        return {
            secondsIntoLoop,
            totalSeconds,
        };
    }

    if (!found && currentQueueEntryId) {
        throw new Error("This track wasn't found in the current play status!");
    }

    return {
        startTime,
        endTime,
        secondsIntoLoop,
        myTurn: startTime <= secondsIntoLoop && secondsIntoLoop <= endTime,
        totalSeconds,
    };
}
