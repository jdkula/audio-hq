import { QueryClient } from '@tanstack/react-query';
import { persistQueryClient, removeOldestQuery } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
            refetchIntervalInBackground: true,
            refetchInterval: 2000,
            staleTime: 1000,
        },
    },
});

if (typeof window !== 'undefined') {
    // @ts-expect-error This is for the sake of serialization below which we expect to work.
    Date.prototype.toJSON = function (key) {
        return { $$date: this.toISOString() };
    };
    const localStoragePersister = createSyncStoragePersister({
        storage: window.localStorage,
        retry: removeOldestQuery,
        deserialize: (str) => {
            return JSON.parse(str, (_, datum) => {
                if (typeof datum === 'object' && datum.$$date) {
                    return new Date(datum.$$date);
                }
                return datum;
            });
        },
    });
    persistQueryClient({
        queryClient,
        persister: localStoragePersister,
    });
}
