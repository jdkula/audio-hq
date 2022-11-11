import { QueryClient, QueryFunction } from '@tanstack/react-query';
import { persistQueryClient, removeOldestQuery } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const defaultQueryFn: QueryFunction<
    unknown,
    [key: string, vars: { query: string; variables: Record<string, unknown> }]
> = async ({ queryKey }) => {
    const [key, { query, variables }] = queryKey;
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
            queryFn: defaultQueryFn as any,
        },
    },
});

const localStoragePersister = createSyncStoragePersister({ storage: window.localStorage, retry: removeOldestQuery });

persistQueryClient({
    queryClient,
    persister: localStoragePersister,
});
