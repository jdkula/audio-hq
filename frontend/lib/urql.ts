import { createClient } from 'graphql-ws';
import { useCallback, useEffect, useState } from 'react';
import { Client, dedupExchange, errorExchange, fetchExchange, gql, subscriptionExchange } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { Cache, cacheExchange } from '@urql/exchange-graphcache';
import customScalarsExchange from 'urql-custom-scalars-exchange';
import schema from '~/graphql.schema.json';
import { IntrospectionQuery } from 'graphql';
import { IntrospectionData } from '@urql/exchange-graphcache/dist/types/ast';
import { File_Set_Input } from './generated/graphql';

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
                        insert_deck_one(_result, _args, cache) {
                            invalidateRootField(cache, 'deck');
                        },
                        insert_track(_result, _args, cache) {
                            invalidateRootField(cache, 'deck');
                        },
                    },
                    Subscription: {
                        event(result, args, cache) {
                            const evt = (result.event as Array<Record<string, never>> | null)?.[0];
                            console.log('Got event', evt);
                            if (evt?.deck || evt?.track) {
                                invalidateRootField(cache, 'deck');
                            } else if (evt?.file) {
                                invalidateRootField(cache, 'file');
                            } else {
                                // Something was deleted– refresh all.
                                invalidateRootField(cache, 'deck');
                                invalidateRootField(cache, 'file');
                            }
                        },
                    },
                },
                optimistic: {
                    update_file_by_pk(args: { _set: File_Set_Input; pk_columns: { id: string } }, cache) {
                        const fileId = args.pk_columns.id;
                        const record: Record<string, any> = {};
                        for (const k of Object.keys(args._set)) {
                            const key = k as keyof typeof args._set;
                            if (args._set[key]) {
                                record[k] = args._set[key];
                            }
                        }

                        const file = cache.readFragment(
                            gql`
                                fragment _ on file {
                                    __typename
                                    id
                                    type
                                    path
                                    name
                                    description
                                    length
                                    ordering
                                    workspace_id
                                    download_url
                                }
                            `,
                            { id: fileId },
                        );

                        return {
                            ...file,
                            ...record,
                        };
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
        if (nonce === 0) return;

        setClient(createUrqlClient());
    }, [nonce]);

    return { client, reinitialize };
}
