import { createClient } from 'graphql-ws';
import { useCallback, useEffect, useState } from 'react';
import {
    Client,
    defaultExchanges,
    subscriptionExchange,
    errorExchange,
    dedupExchange,
    fetchExchange,
    cacheExchange as documentCacheExchange,
} from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { cacheExchange } from '@urql/exchange-graphcache';
import customScalarsExchange from 'urql-custom-scalars-exchange';
import schema from '~/graphql.schema.json';
import { Play_Status, PlayTrackMutation } from './generated/graphql';
import { IntrospectionData } from '@urql/exchange-graphcache/dist/types/ast';

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
            customScalarsExchange({ schema: schema as any, scalars: { timestamptz: (value) => new Date(value) } }),
            dedupExchange,
            // documentCacheExchange,
            cacheExchange({
                schema: schema as IntrospectionData,
                updates: {
                    Mutation: {
                        insert_play_status_one(_result, args, cache, _info) {
                            cache
                                .inspectFields('query_root')
                                .filter((field) => field.fieldName === 'play_status')
                                .forEach((field) => {
                                    console.log('Invalidating in mutation', field);
                                    cache.invalidate('query_root', field.fieldKey);
                                });
                        },
                    },
                    Subscription: {
                        event(_result, args, cache, _info) {
                            const invalidator = ((_result.event as any)?.[0]?.invalidate as string) ?? undefined;
                            cache
                                .inspectFields('query_root')
                                .filter((field) => field.fieldName === invalidator)
                                .forEach((field) => {
                                    console.log('Invalidating in subscription', field);
                                    cache.invalidate('query_root', field.fieldKey);
                                });
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
