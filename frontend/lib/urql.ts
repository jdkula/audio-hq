import { createClient } from 'graphql-ws';
import { useCallback, useEffect, useState } from 'react';
import { Client, subscriptionExchange, errorExchange, dedupExchange, fetchExchange } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { cacheExchange, Cache } from '@urql/exchange-graphcache';
import customScalarsExchange from 'urql-custom-scalars-exchange';
import schema from '~/graphql.schema.json';
import { IntrospectionQuery } from 'graphql';
import { IntrospectionData } from '@urql/exchange-graphcache/dist/types/ast';

function invalidateRootField(cache: Cache, fieldName: string) {
    cache
        .inspectFields('query_root')
        .filter((field) => field.fieldName === fieldName)
        .forEach((field) => {
            console.log('Invalidating in mutation', field);
            cache.invalidate('query_root', field.fieldKey);
        });
}

function createUrqlClient(): Client {
    if (typeof window === 'undefined') {
        return new Client({ url: process.env.NEXT_PUBLIC_HASURA_URL_HTTP as string });
    }
    const wsClient = createClient({
        url: process.env.NEXT_PUBLIC_HASURA_URL_WS as string,
        retryAttempts: 10,
    });

    return new Client({
        url: process.env.NEXT_PUBLIC_HASURA_URL_HTTP as string,
        exchanges: [
            devtoolsExchange,
            errorExchange({
                onError: (error, operation) => {
                    console.warn(error, operation);
                },
            }),
            customScalarsExchange({
                schema: schema as unknown as IntrospectionQuery,
                scalars: { timestamptz: (value) => new Date(value) },
            }),
            dedupExchange,
            // documentCacheExchange,
            cacheExchange({
                schema: schema as IntrospectionData,
                updates: {
                    Mutation: {
                        insert_play_status_one(_result, _args, cache) {
                            invalidateRootField(cache, 'play_status');
                        },
                        insert_play_queue_entry(_result, _args, cache) {
                            invalidateRootField(cache, 'play_status');
                        },
                    },
                    Subscription: {
                        event(result, args, cache) {
                            const invalidatedField = (result.event as Array<{ invalidate: string }>)[0]?.invalidate;
                            invalidateRootField(cache, invalidatedField);
                        },
                    },
                },
            }),
            fetchExchange,
            subscriptionExchange({
                forwardSubscription: (operation) => ({
                    subscribe: (sink) => ({
                        unsubscribe: wsClient.subscribe(operation, sink),
                    }),
                }),
            }),
        ],
    });
}

export function useUrqlClient(): { client: Client; reinitialize: () => void } {
    const [client, setClient] = useState(() => createUrqlClient());
    const [nonce, setNonce] = useState(0);

    const reinitialize = useCallback(() => setNonce((nonce) => nonce + 1), [setNonce]);

    useEffect(() => {
        if (nonce == 0) return;

        setClient(createUrqlClient());
    }, [nonce]);

    return { client, reinitialize };
}
