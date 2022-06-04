/**
 * urql.ts
 * ========
 * Implements the URQL client, including optimistic resolvers and
 * mutation update resolvers that allow Audio HQ to work offline
 */
import { createClient } from 'graphql-ws';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Client, dedupExchange, errorExchange, fetchExchange, gql, subscriptionExchange } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { Cache, offlineExchange } from '@urql/exchange-graphcache';
import * as GQL from '../generated/graphql';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';
import { LocalStorageReactiveValue, useLocalReactiveValue } from '../LocalReactive';
import { add, differenceInMilliseconds } from 'date-fns';
import schema from '../generated/schema';
import Mutation from './mutation';
import Optimistic from './optimistic';
import { isDefined } from '../utility/util';

function invalidateRootField(cache: Cache, fieldName: string) {
    cache
        .inspectFields('query_root')
        .filter((field) => field.fieldName === fieldName)
        .forEach((field) => {
            console.log('Invalidating in mutation', field);
            cache.invalidate('query_root', field.fieldKey);
        });
}

function createUrqlClient(addresses: UrqlAddresses): Client {
    if (typeof window === 'undefined') {
        return new Client({ url: addresses.http });
    }
    const wsClient = createClient({
        url: addresses.websocket,
        retryAttempts: 10,
    });

    const storage = makeDefaultStorage({
        idbName: 'ahq-graphcache-v1',
        maxAge: 7,
    });

    return new Client({
        url: addresses.http,
        requestPolicy: 'cache-and-network',
        exchanges: [
            devtoolsExchange,
            errorExchange({
                onError: (error, operation) => {
                    console.warn(error, operation);
                },
            }),
            dedupExchange,
            // documentCacheExchange,
            offlineExchange({
                schema: schema,
                storage,
                resolvers: {
                    Query: {
                        workspace_by_pk: (result) => {
                            console.log('WBPK', result);
                            return result;
                        },
                    },
                },
                updates: {
                    Mutation: {
                        insert_deck(result: GQL.Deck_Mutation_Response, args: GQL.Mutation_RootInsert_DeckArgs, cache) {
                            result.returning?.forEach((deck) => {
                                const wsId = deck.workspace_id;
                                if (wsId) {
                                    Mutation.addDeck(wsId, { ...deck }, cache);
                                } else {
                                    invalidateRootField(cache, 'workspace_by_pk');
                                }
                            });
                        },
                        insert_deck_one(resultRaw, args: GQL.Mutation_RootInsert_Deck_OneArgs, cache) {
                            const result = resultRaw.insert_deck_one as GQL.Deck | null;
                            const wsId = result?.workspace_id ?? args.object.workspace_id;
                            if (wsId && result) {
                                Mutation.addDeck(wsId, { ...result }, cache);
                            } else {
                                invalidateRootField(cache, 'workspace_by_pk');
                            }
                        },
                        delete_deck_by_pk(resultRaw, args: GQL.Mutation_RootDelete_Deck_By_PkArgs, cache) {
                            const result = resultRaw.delete_deck_by_pk as GQL.Deck;
                            const wsId = result?.workspace_id;
                            if (wsId && result?.id) {
                                Mutation.delDeck(wsId, result.id, cache);
                            } else {
                                invalidateRootField(cache, 'workspace_by_pk');
                            }
                        },
                        insert_track(
                            result: GQL.Track_Mutation_Response,
                            args: GQL.Mutation_RootInsert_TrackArgs,
                            cache,
                        ) {
                            for (const track of result?.returning ?? []) {
                                if (!track.deck_id) continue;
                                Mutation.addTrack({ ...track }, cache);
                            }
                        },
                        delete_track(
                            result: GQL.Track_Mutation_Response,
                            args: GQL.Mutation_RootDelete_TrackArgs,
                            cache,
                        ) {
                            const deckId = args.where.deck?.id?._eq || args.where.deck_id?._eq;
                            if (!deckId) {
                                invalidateRootField(cache, 'deck');
                            } else {
                                for (const track of result?.returning ?? []) {
                                    if (!track.deck_id) continue;
                                    Mutation.delTrack(deckId, track.id, cache);
                                }
                            }
                        },
                        update_deck_by_pk(result, _, cache) {
                            if (!result.update_deck_by_pk) {
                                invalidateRootField(cache, 'workspace_by_pk');
                            }
                        },
                    },
                },
                optimistic: {
                    update_file_by_pk(args: { _set: GQL.File_Set_Input; pk_columns: { id: string } }, cache) {
                        const fileId = args.pk_columns.id;
                        const record: Partial<typeof args._set> = {};
                        for (const k of Object.keys(args._set)) {
                            const key = k as keyof typeof args._set;
                            record[key] = args._set[key];
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
                    insert_deck(args: GQL.Mutation_RootInsert_DeckArgs, cache): GQL.Deck_Mutation_Response {
                        return {
                            affected_rows: args.objects.length,
                            returning: args.objects
                                .map((input) => {
                                    const deck = Optimistic.deck(input, cache);
                                    return deck;
                                })
                                .filter(isDefined),
                        };
                    },
                    insert_deck_one(args: GQL.Mutation_RootInsert_Deck_OneArgs, cache) {
                        return Optimistic.deck(args.object, cache);
                    },
                    delete_deck_by_pk(args: GQL.Mutation_RootDelete_Deck_By_PkArgs, cache) {
                        const deckId = args.id;
                        const deck = cache.readFragment(
                            gql`
                                fragment _ on deck {
                                    __typename
                                    id
                                    type
                                    volume
                                    speed
                                    pause_timestamp
                                    start_timestamp
                                    workspace_id
                                }
                            `,
                            { id: deckId },
                        );

                        return deck;
                    },
                    insert_track(args: GQL.Mutation_RootInsert_TrackArgs, cache): GQL.Track_Mutation_Response {
                        return {
                            affected_rows: args.objects.length,
                            returning: args.objects
                                .map((input) => {
                                    const track = Optimistic.track(input, cache);
                                    return track;
                                })
                                .filter(isDefined),
                        };
                    },
                    delete_track(args: GQL.Mutation_RootDelete_TrackArgs, cache): GQL.Track_Mutation_Response | null {
                        const deckId = args.where.deck_id?._eq ?? args.where.deck?.id?._eq;
                        if (!deckId) return null;

                        const deck: Partial<GQL.Deck> | null = cache.readFragment(
                            gql`
                                fragment _ on deck {
                                    __typename
                                    id
                                    queue {
                                        __typename
                                        id
                                        created_at
                                    }
                                }
                            `,
                            { id: deckId },
                        );

                        if (!deck?.queue) return null;

                        return {
                            affected_rows: deck.queue.length,
                            returning: deck.queue,
                        };
                    },
                    update_deck_by_pk(args: GQL.Mutation_RootUpdate_Deck_By_PkArgs, cache): GQL.Deck | null {
                        const deckFrag = gql`
                            fragment _ on deck {
                                __typename
                                id
                                pause_timestamp
                                start_timestamp
                                speed
                                volume
                                workspace_id
                                created_at
                                type
                                queue {
                                    __typename
                                    id
                                    created_at
                                    ordering
                                    deck_id
                                    file {
                                        __typename
                                        id
                                        name
                                        description
                                        download_url
                                        length
                                        ordering
                                        type
                                        path
                                        workspace_id
                                    }
                                }
                            }
                        `;
                        const deck: GQL.Deck | null = cache.readFragment(deckFrag, {
                            id: args.pk_columns.id as string,
                            __typename: 'deck',
                        });
                        if (!deck) return null;

                        let start_timestamp = deck.start_timestamp;
                        if (args._set?.start_timestamp) {
                            start_timestamp = args._set.start_timestamp;
                        } else if (
                            args._set?.pause_timestamp === null &&
                            deck.pause_timestamp !== null &&
                            deck.pause_timestamp !== undefined
                        ) {
                            start_timestamp = add(new Date(deck.start_timestamp), {
                                seconds:
                                    differenceInMilliseconds(new Date(), new Date(deck.pause_timestamp)) /
                                    (args._set?.speed ?? deck.speed ?? 1) /
                                    1000,
                            }).toISOString();
                        }

                        const final_pause =
                            args._set?.pause_timestamp !== undefined
                                ? args._set.pause_timestamp ?? null
                                : deck.pause_timestamp ?? null;

                        const retDeck = {
                            ...deck,
                            pause_timestamp: final_pause,
                            start_timestamp,
                            speed: args._set?.speed ?? deck.speed,
                            volume: args._set?.volume ?? deck.volume,
                        };

                        return retDeck;
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

type UrqlAddresses = { websocket: string; http: string };

const urqlAddresses = new LocalStorageReactiveValue<UrqlAddresses>('urql_address', {
    http: (process.env.NEXT_PUBLIC_HASURA_URL_HTTP as string | undefined) ?? '/v1/graphql',
    websocket: (process.env.NEXT_PUBLIC_HASURA_URL_WS as string | undefined) ?? '/v1/graphql',
});

export function useUrqlAddresses(): UrqlAddresses {
    const [addresses, setUrqlAddresses] = useLocalReactiveValue(urqlAddresses);

    useEffect(() => {
        fetch('/config.json')
            .then((body) => body.json())
            .then((info) => {
                setUrqlAddresses(info);
            })
            .catch((e) => {
                console.log("Didn't get config", e);
            });
    }, [setUrqlAddresses]);

    return addresses;
}

export function useUrqlClient(addresses: UrqlAddresses): { client: Client; reinitialize: () => void } {
    const [client, setClient] = useState(() => createUrqlClient(addresses));
    const [nonce, setNonce] = useState(0);

    const prevAddresses = useRef(addresses);

    const reinitialize = useCallback(() => setNonce((nonce) => nonce + 1), [setNonce]);

    useEffect(() => {
        if (nonce === 0 && addresses === prevAddresses.current) return;
        prevAddresses.current = addresses;

        setClient(createUrqlClient(addresses));
    }, [nonce, addresses, prevAddresses]);

    return { client, reinitialize };
}
