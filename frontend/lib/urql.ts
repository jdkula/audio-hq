import { createClient } from 'graphql-ws';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Client, dedupExchange, errorExchange, fetchExchange, gql, subscriptionExchange } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { Cache, offlineExchange, Entity } from '@urql/exchange-graphcache';
import customScalarsExchange from 'urql-custom-scalars-exchange';
import schema from '~/graphql.schema.json';
import { IntrospectionQuery } from 'graphql';
import { IntrospectionData } from '@urql/exchange-graphcache/dist/types/ast';
import * as GQL from './generated/graphql';
import _ from 'lodash';
import { v4 } from 'uuid';
import { nonNull } from './utility';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';
import { LocalStorageReactiveValue, useLocalReactiveValue } from './local_reactive';
import { add, differenceInMilliseconds } from 'date-fns';

function getFields<T>(type: string, id: any, cache: Cache, fields: Array<keyof T>): Partial<T> | null {
    const record: Partial<T> = {};
    const key = cache.keyOfEntity({ __typename: type, id });
    const hasId = cache.resolve(key, 'id');

    if (!hasId) return null;
    for (const field of fields) {
        record[field] = cache.resolve(key, field as string) as T[keyof T];
    }

    return record;
}

function invalidateRootField(cache: Cache, fieldName: string) {
    cache
        .inspectFields('query_root')
        .filter((field) => field.fieldName === fieldName)
        .forEach((field) => {
            console.log('Invalidating in mutation', field);
            cache.invalidate('query_root', field.fieldKey);
        });
}

function addDeck(workspaceId: string, deck: GQL.Deck, cache: Cache) {
    cache.updateQuery<GQL.DecksQuery, GQL.DecksQueryVariables>(
        { query: GQL.DecksDocument, variables: { workspaceId } },
        (data) => {
            if (!data?.workspace_by_pk?.decks) return data;

            let decks = data?.workspace_by_pk?.decks;
            if (deck.type === GQL.Deck_Type_Enum_Enum.Main)
                decks = decks.filter((deck) => deck.type !== GQL.Deck_Type_Enum_Enum.Main);
            decks.push(deck);

            data.workspace_by_pk.decks = decks;

            return data;
        },
    );
}

function delDeck(workspaceId: string, deckId: string, cache: Cache) {
    cache.updateQuery<GQL.DecksQuery, GQL.DecksQueryVariables>(
        { query: GQL.DecksDocument, variables: { workspaceId } },
        (data) => {
            if (!data?.workspace_by_pk?.decks) return data;

            let decks = data?.workspace_by_pk?.decks;
            decks = decks.filter((deck) => deck.id !== deckId);
            data.workspace_by_pk.decks = decks;

            return data;
        },
    );
}

function addTrack(track: GQL.Track, cache: Cache) {
    const key = cache.keyOfEntity({ __typename: 'deck', id: track.deck_id });
    const workspaceId = cache.resolve(key, 'workspace_id') as string;

    cache.updateQuery<GQL.DecksQuery, GQL.DecksQueryVariables>(
        { query: GQL.DecksDocument, variables: { workspaceId } },
        (data) => {
            if (!data?.workspace_by_pk?.decks) return data;

            const decks = data?.workspace_by_pk?.decks;
            const deck = decks.find((deck) => deck.id === track.deck_id);
            if (!deck) return data;
            deck.queue.push(track);
            deck.queue.sort();

            return data;
        },
    );
}

function delTrack(deckId: string, trackId: string, cache: Cache) {
    const key = cache.keyOfEntity({ __typename: 'deck', id: deckId });
    const workspaceId = cache.resolve(key, 'workspace_id') as string;

    cache.updateQuery<GQL.DecksQuery, GQL.DecksQueryVariables>(
        { query: GQL.DecksDocument, variables: { workspaceId } },
        (data) => {
            if (!data?.workspace_by_pk?.decks) return data;

            const decks = data?.workspace_by_pk?.decks;
            const deck = decks.find((deck) => deck.id === deckId);
            if (!deck) return data;
            deck.queue = deck.queue.filter((track) => track.id !== trackId);

            return data;
        },
    );
}

function optimisticDeck(input: GQL.Deck_Insert_Input, cache: Cache): GQL.Deck | null {
    if (!input.workspace_id) return null;
    const workspace = getFields<GQL.Workspace>('workspace', input.workspace_id, cache, [
        'id',
        'name',
        'created_at',
        'updated_at',
    ]) as GQL.Workspace;
    if (!workspace) return null;

    const id = input.id ?? v4();
    return {
        created_at: new Date(),
        id,
        queue:
            input.queue?.data
                ?.map((trackInput) => optimisticTrack({ ...trackInput, deck_id: id }, cache))
                .filter(nonNull) ?? [],
        speed: input.speed ?? 1,
        volume: input.volume ?? 1,
        type: input.type ?? GQL.Deck_Type_Enum_Enum.Main,
        start_timestamp: input.start_timestamp ?? new Date(),
        pause_timestamp: input.pause_timestamp ?? null,
        workspace_id: input.workspace_id,
        workspace: { ...workspace, __typename: 'workspace' },
        __typename: 'deck',
    };
}

function optimisticTrack(input: GQL.Track_Insert_Input, cache: Cache): GQL.Track | null {
    if (!input.deck_id) return null;
    if (!input.file_id) return null;

    const file = cache.readFragment(
        gql`
            fragment _ on file {
                __typename
                id
                description
                name
                download_url
                length
                ordering
                path
                type
                workspace_id
            }
        `,
        { id: input.file_id, __typename: 'file' },
    );

    if (!file) return null;

    return {
        created_at: new Date(),
        id: input.id ?? v4(),
        deck: null as never,
        deck_id: input.deck_id,
        file_id: input.file_id,
        file: file,
        ordering: input.ordering ?? Infinity,
        __typename: 'track',
    };
}

function optimisticJob(input: GQL.Job_Insert_Input, cache: Cache): GQL.Job | null {
    if (!input.workspace_id) return null;

    return {
        id: v4(),
        created_at: new Date(),
        name: input.name ?? '',
        url: input.url ?? '',
        description: input.description ?? '',
        path: input.path ?? [],
        options: input.options ?? {},
        progress_stage: 'waiting',
        workspace_id: input.workspace_id,
        assigned_worker: null,
        progress: 0,
    };
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
            offlineExchange({
                schema: schema as IntrospectionData,
                storage,
                updates: {
                    Mutation: {
                        insert_deck(result: GQL.Deck_Mutation_Response, args: GQL.Mutation_RootInsert_DeckArgs, cache) {
                            result.returning?.forEach((deck) => {
                                const wsId = deck.workspace_id;
                                if (wsId) {
                                    addDeck(wsId, { ...deck }, cache);
                                }
                            });
                        },
                        insert_deck_one(resultRaw, args: GQL.Mutation_RootInsert_Deck_OneArgs, cache) {
                            const result = resultRaw.insert_deck_one as GQL.Deck | null;
                            const wsId = result?.workspace_id ?? args.object.workspace_id;
                            if (wsId && result) {
                                addDeck(wsId, { ...result }, cache);
                            }
                        },
                        delete_deck_by_pk(resultRaw, args: GQL.Mutation_RootDelete_Deck_By_PkArgs, cache) {
                            const result = resultRaw.delete_deck_by_pk as GQL.Deck;
                            const wsId = result?.workspace_id;
                            if (wsId && result?.id) {
                                delDeck(wsId, result.id, cache);
                            }
                        },
                        insert_track(
                            result: GQL.Track_Mutation_Response,
                            args: GQL.Mutation_RootInsert_TrackArgs,
                            cache,
                        ) {
                            for (const track of result?.returning ?? []) {
                                if (!track.deck_id) continue;
                                addTrack({ ...track }, cache);
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
                                    delTrack(deckId, track.id, cache);
                                }
                            }
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
                    update_file_by_pk(args: { _set: GQL.File_Set_Input; pk_columns: { id: string } }, cache) {
                        const fileId = args.pk_columns.id;
                        const record: Record<string, any> = {};
                        for (const k of Object.keys(args._set)) {
                            const key = k as keyof typeof args._set;
                            record[k] = args._set[key];
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
                                    const deck = optimisticDeck(input, cache);
                                    return deck;
                                })
                                .filter(nonNull),
                        };
                    },
                    insert_deck_one(args: GQL.Mutation_RootInsert_Deck_OneArgs, cache) {
                        return optimisticDeck(args.object, cache);
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
                                    const deck = optimisticTrack(input, cache);
                                    return deck;
                                })
                                .filter(nonNull),
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
                        const deck: GQL.Deck | null = cache.readFragment(
                            gql`
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
                            `,
                            { id: args.pk_columns.id as string, __typename: 'deck' },
                        );
                        if (!deck) return null;

                        let start_timestamp = deck.start_timestamp;
                        if (args._set?.start_timestamp) {
                            start_timestamp = args._set.start_timestamp;
                        } else if (args._set?.pause_timestamp === null && deck.pause_timestamp !== null) {
                            const pt =
                                typeof deck.pause_timestamp === 'string'
                                    ? new Date(deck.pause_timestamp)
                                    : deck.pause_timestamp;

                            start_timestamp = add(new Date(deck.start_timestamp), {
                                seconds:
                                    differenceInMilliseconds(new Date(), pt ?? new Date()) /
                                    (args._set?.speed ?? deck.speed ?? 1) /
                                    1000,
                            });
                        }

                        return {
                            ...deck,
                            pause_timestamp:
                                args._set?.pause_timestamp !== undefined
                                    ? args._set.pause_timestamp
                                    : deck.pause_timestamp,
                            start_timestamp: start_timestamp,
                            speed: args._set?.speed ?? deck.speed,
                            volume: args._set?.volume ?? deck.volume,
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
