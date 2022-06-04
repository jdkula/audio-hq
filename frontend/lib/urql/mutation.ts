/**
 * mutation.ts
 * =============
 * Implements some helper functiosn that operate on the urql graphcache
 */
import * as GQL from '../generated/graphql';
import { Cache } from '@urql/exchange-graphcache';

export default class Mutation {
    static addDeck(workspaceId: string, deck: GQL.Deck, cache: Cache) {
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

    static delDeck(workspaceId: string, deckId: string, cache: Cache) {
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

    static addTrack(track: GQL.Track, cache: Cache) {
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

    static delTrack(deckId: string, trackId: string, cache: Cache) {
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
}
