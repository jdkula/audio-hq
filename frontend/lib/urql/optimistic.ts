import * as GQL from '../generated/graphql';
import { gql } from 'urql';
import { Cache } from '@urql/exchange-graphcache';
import { v4 } from 'uuid';
import { isDefined } from '../utility/util';

export default class Optimistic {
    static deck(input: GQL.Deck_Insert_Input, cache: Cache): GQL.Deck | null {
        if (!input.workspace_id) return null;
        const workspace = cache.readFragment<GQL.Workspace>(
            gql`
                fragment _ on workspace {
                    __typename
                    id
                    name
                    created_at
                    updated_at
                }
            `,
            { id: input.workspace_id, __typename: 'workspace' },
        );
        if (!workspace) return null;

        const id = input.id ?? v4();
        return {
            created_at: new Date().toISOString(),
            id,
            queue:
                input.queue?.data
                    ?.map((trackInput) => Optimistic.track({ ...trackInput, deck_id: id }, cache))
                    .filter(isDefined) ?? [],
            speed: input.speed ?? 1,
            volume: input.volume ?? 1,
            type: input.type ?? GQL.Deck_Type_Enum_Enum.Main,
            start_timestamp: input.start_timestamp ?? new Date().toISOString(),
            pause_timestamp: input.pause_timestamp ?? null,
            workspace_id: input.workspace_id,
            workspace: workspace,
            __typename: 'deck',
        };
    }

    static track(input: GQL.Track_Insert_Input, cache: Cache): GQL.Track | null {
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
            created_at: new Date().toISOString(),
            id: input.id ?? v4(),
            deck: null as never,
            deck_id: input.deck_id,
            file_id: input.file_id,
            file: file,
            ordering: input.ordering ?? Infinity,
            __typename: 'track',
        };
    }

    static job(input: GQL.Job_Insert_Input): GQL.Job | null {
        if (!input.workspace_id) return null;

        return {
            id: v4(),
            created_at: new Date().toISOString(),
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
}
