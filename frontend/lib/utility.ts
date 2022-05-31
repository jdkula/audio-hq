import {
    createContext,
    DependencyList,
    Dispatch,
    EffectCallback,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { Set } from 'immutable';
import { File_Minimum, Play_Status_Minimum } from './graphql_type_helper';
import { Play_Status_Type_Enum_Enum, useEventsSubscription, usePlayStatusesQuery } from './generated/graphql';
import { useRouter } from 'next/router';
import { getUnixTime } from 'date-fns';

interface CurrentFileInfo {
    file: File_Minimum;
    index: number;
    duration: number; // in s
    totalTimeBefore: number; // in s
}

export function shouldPlaySFX(sfx: Play_Status_Minimum): boolean {
    const lastTrigger = parseInt(localStorage.getItem('__AHQ_LAST_SFX') ?? '0');
    const fullTime = sfx.queue.reduce((time, q) => time + q.file.length, 0);
    const valid =
        getUnixTime(sfx.start_timestamp) + fullTime < getUnixTime(new Date()) &&
        getUnixTime(sfx.start_timestamp) > lastTrigger;

    if (valid) {
        localStorage.setItem('__AHQ_LAST_SFX', JSON.stringify(getUnixTime(sfx.start_timestamp)));
    }
    return valid;
}

export function useAlt(): boolean {
    const [altDown, setAlt] = useState(false);

    useEffect(() => {
        const fn = (ev: KeyboardEvent) => {
            setAlt(ev.altKey);
        };
        document.addEventListener('keydown', fn);
        document.addEventListener('keyup', fn);
        return () => {
            document.removeEventListener('keydown', fn);
            document.removeEventListener('keyup', fn);
        };
    }, []);

    return altDown;
}

export function toTimestamp(seconds: number): string {
    if (seconds < 0) return `${Math.floor(seconds)}`;

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const secondsPadded = seconds.toFixed(0).padStart(2, '0');
    const minutesPadded = minutes.toFixed(0).padStart(2, '0');
    if (hours) {
        return `${hours}:${minutesPadded}:${secondsPadded}`;
    } else {
        return `${minutes}:${secondsPadded}`;
    }
}

export function getTrackInfo(status: Play_Status_Minimum, idx?: number): CurrentFileInfo | null {
    // debugger;
    const files = status.queue.map((x) => x.file);

    if (!allNonNull(files) || status.start_timestamp === null) {
        return null;
    }

    const totalTime = files.reduce((prev, cur) => prev + cur.length, 0); // in seconds
    const curTs = getUnixTime(status.pause_timestamp ?? new Date());
    const curDuration = ((curTs - getUnixTime(status.start_timestamp)) * status.speed) % totalTime; // in seconds
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

export function allNonNull<T>(list: (T | null | undefined)[]): list is T[] {
    for (const x of list) {
        if (!nonNull(x)) {
            return false;
        }
    }
    return true;
}

export function nonNull<T>(elem: T | null | undefined): elem is T {
    return elem !== null && elem !== undefined;
}

const localStorageListeners: Record<string, Dispatch<SetStateAction<any | null>>[]> = {};

function getLocalStorage<T>(key: string, defaultValue?: T): T | null;
function getLocalStorage<T>(key: string, defaultValue: T): T;
function getLocalStorage<T>(key: string): T | null;
function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue ?? null;

    return JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultValue ?? null;
}

export function useLocalStorage<T>(key: string): [value: T | null, setValue: Dispatch<SetStateAction<T | null>>];
export function useLocalStorage<T>(key: string, defaultValue: T): [value: T, setValue: Dispatch<SetStateAction<T>>];
export function useLocalStorage<T>(
    key: string,
    defaultValue?: T,
): [value: T | null, setValue: Dispatch<SetStateAction<T | null>>] {
    const [value, setValueInternal] = useState<T | null>(getLocalStorage<T>(key, defaultValue));

    useEffect(() => {
        setValueInternal(getLocalStorage<T>(key, defaultValue));
    }, [key, defaultValue]);

    useEffect(() => {
        if (localStorageListeners[key] === undefined) {
            localStorageListeners[key] = [];
        }

        localStorageListeners[key].push(setValueInternal);
        return () => {
            const idx = localStorageListeners[key].indexOf(setValueInternal);
            localStorageListeners[key].splice(idx, 1);
        };
    }, [key, setValueInternal]);

    const setValue = useCallback(
        (newValue: SetStateAction<T | null>) => {
            const curVal = getLocalStorage(key, defaultValue);
            const newValueInternal = newValue instanceof Function ? newValue(curVal) : newValue;

            window.localStorage.setItem(key, JSON.stringify(newValueInternal));
            for (const listener of localStorageListeners[key] ?? []) {
                listener(newValueInternal);
            }
        },
        [key, defaultValue],
    );

    return [value, setValue];
}

const kColorModeKey = '__AHQ_SAVED_COLOR_MODE';

export type ColorMode = 'auto' | 'light' | 'dark';
type ColorModeHook = [mode: ColorMode, setColorMode: (cm: ColorMode) => void];

export function useColorMode(): ColorModeHook {
    const [cm, setCm] = useLocalStorage<ColorMode>(kColorModeKey);

    return [cm ?? 'auto', setCm];
}

interface Favorites {
    favorites: Set<string>;
    removeFavorite: (id: string) => void;
    addFavorite: (id: string) => void;
}

const kFavoriteKey = '__AHQ_FAVORITES';

export function useFavorites(): Favorites {
    const [favorites, setFavorites] = useLocalStorage<Set<string>>(kFavoriteKey, Set());

    return {
        favorites,
        removeFavorite: (id) => setFavorites((s) => s.add(id)),
        addFavorite: (id) => setFavorites((s) => s.remove(id)),
    };
}

const kLocalRecentKey = '__AHQ_RECENT_WORKSPACES';
const kMaxRecents = 5;

type LocalRecents = [recents: string[], addRecent: (workspace: string) => void];

export function useLocalRecents(): LocalRecents {
    const [recents, setRecentsInternal] = useLocalStorage<string[]>(kLocalRecentKey);

    const setRecents = useCallback(
        (workspace: string) =>
            setRecentsInternal((recents) =>
                [workspace, ...(recents ?? []).filter((ws) => ws !== workspace)].slice(0, kMaxRecents),
            ),
        [],
    );

    return [recents ?? [], setRecents];
}

export function usePeriodicEffect(
    periodMs: number,
    effect: EffectCallback,
    deps?: DependencyList,
): ReturnType<typeof useEffect> {
    const [iterator, setIterator] = useState(0);
    useEffect(() => {
        const handle = window.setInterval(() => setIterator((n) => n + 1), periodMs);
        return () => window.clearInterval(handle);
    }, [periodMs]);

    return useEffect(effect, [iterator, effect, ...(deps ?? [])]);
}

export function useWorkspaceStatuses(workspaceId: string): {
    main: Play_Status_Minimum | null;
    ambience: Play_Status_Minimum[];
    sfx: Play_Status_Minimum[];
} {
    useEventsSubscription({
        variables: { workspaceId: workspaceId },
    });

    const [{ data: statusData }] = usePlayStatusesQuery({
        variables: { workspaceId },
    });

    const main = statusData?.play_status.filter((x) => x.type === Play_Status_Type_Enum_Enum.Main)[0] ?? null;
    const ambience = statusData?.play_status.filter((x) => x.type === Play_Status_Type_Enum_Enum.Ambience) ?? [];
    const sfx = statusData?.play_status.filter((x) => x.type === Play_Status_Type_Enum_Enum.Sfx) ?? [];

    return { main, ambience, sfx };
}

export function useQueryParameter(id: string): string | null {
    const router = useRouter();

    return (router.query[id] as string) ?? null;
}

export const WorkspaceIdContext = createContext('');
export const WorkspaceNameContext = createContext('');
