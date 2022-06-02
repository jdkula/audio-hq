import { Client, dedupExchange, errorExchange, fetchExchange, subscriptionExchange } from '@urql/core';
import { createClient } from 'graphql-ws';
import { cacheExchange } from '@urql/exchange-graphcache';
import { WebSocket } from 'ws';

export function createUrqlClient(): Client {
    const wsClient = createClient({
        url: process.env.NEXT_PUBLIC_HASURA_URL_WS as string,
        retryAttempts: 10,
        webSocketImpl: WebSocket,
        connectionParams: {
            headers: {
                'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
                'X-Hasura-Role': 'worker',
            },
        },
    });

    return new Client({
        url: process.env.NEXT_PUBLIC_HASURA_URL_HTTP as string,
        fetchOptions: {
            headers: {
                'X-Hasura-Admin-Secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
                'X-Hasura-Role': 'worker',
            },
        },
        exchanges: [
            errorExchange({
                onError: (error, operation) => {
                    console.warn(error, operation);
                },
            }),
            dedupExchange,
            cacheExchange({}),
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
