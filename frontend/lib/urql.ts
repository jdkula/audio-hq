import { createClient } from 'graphql-ws';
import { useCallback, useEffect, useState } from 'react';
import { Client, defaultExchanges, subscriptionExchange } from 'urql';

function createUrqlClient(): Client {
    const wsClient = createClient({
        url: process.env.NEXT_PUBLIC_HASURA_URL_WS as string,
        retryAttempts: 10,
    });

    const client = new Client({
        url: process.env.NEXT_PUBLIC_HASURA_URL_HTTP as string,
        exchanges: [
            ...defaultExchanges,
            subscriptionExchange({
                forwardSubscription: (operation) => ({
                    subscribe: (sink) => ({
                        unsubscribe: wsClient.subscribe(operation, sink),
                    }),
                }),
            }),
        ],
    });

    return client;
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
