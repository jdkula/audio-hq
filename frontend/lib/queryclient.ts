import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { Persister } from '@tanstack/react-query-persist-client';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60 * 60 * 24 * 31, // 31 days
            refetchIntervalInBackground: true,
            refetchInterval: 2000,
            staleTime: 1000,
        },
    },
});

export let localStoragePersister: Persister = null as never;

if (typeof window !== 'undefined') {
    // @ts-expect-error Needed to serialize dates correctly. Yes, it's extremely janky.
    Date.prototype.toJSON = function (key) {
        return { $$date: this.toISOString() };
    };

    localStoragePersister = createSyncStoragePersister({
        storage: window.localStorage,
        deserialize: (str) =>
            JSON.parse(str, (_, datum) => (typeof datum === 'object' && datum.$$date ? new Date(datum.$$date) : datum)),
    });
}
