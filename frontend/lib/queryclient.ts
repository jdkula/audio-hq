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
    const localStoragePersister = createSyncStoragePersister({
        storage: window.localStorage,
        retry: removeOldestQuery,
    });
    persistQueryClient({
        queryClient,
        persister: localStoragePersister,
    });
}
