import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { Persister, removeOldestQuery } from '@tanstack/react-query-persist-client';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: Number.POSITIVE_INFINITY, // 31 days
            refetchIntervalInBackground: true,
            refetchInterval: 2000,
            staleTime: 1000,
            retry: 0,
        },
    },
});

export let localStoragePersister: Persister = null as never;

if (typeof window !== 'undefined') {
    // @ts-expect-error Needed to serialize dates correctly. Yes, it's extremely janky.
    Date.prototype.toJSON = function () {
        return { $$date: this.toISOString() };
    };

    localStoragePersister = createSyncStoragePersister({
        storage: window.localStorage,
        deserialize: (str) =>
            JSON.parse(str, (_, datum) =>
                typeof datum === 'object' && datum?.$$date ? new Date(datum.$$date) : datum,
            ),
        retry: removeOldestQuery,
    });
}
