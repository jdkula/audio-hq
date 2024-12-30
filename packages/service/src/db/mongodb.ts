import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import type { SelectNonNullable, NonNullableRecursive } from '@audio-hq/common/lib/helpers';
const uri = process.env.DB_URI as string;
import * as API from '@audio-hq/common/lib/api/transport/models';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

type OmitId<T> = Omit<T, 'id'>;
type WithMongoId<T> = OmitId<T> & { _id?: ObjectId };
type WithMongoIdWorkspace<T> = WithMongoId<T> & { _workspace: ObjectId };

export type WorkspaceCollectionType = WithMongoId<NonNullableRecursive<API.Workspace, ObjectId>>;
export type JobsCollectionType = WithMongoIdWorkspace<
    SelectNonNullable<
        Omit<API.Job, 'unassigned' | 'ok' | 'assignedWorker' | 'workspace'>,
        'details' | 'status' | 'source',
        ObjectId
    >
> & { assignedWorker: ObjectId | null; assignedAt: number };
export type EntriesCollectionType = WithMongoIdWorkspace<{
    name: string;
    path: string[];
    ordering: number;

    isFolder: boolean;
    single?: NonNullableRecursive<OmitId<API.Single> & { provider_id: string }, ObjectId>;
}>;
export type DecksCollectionType = WithMongoIdWorkspace<
    NonNullableRecursive<Omit<API.Deck, 'queue' | 'pausedTimestamp'>, ObjectId>
> & {
    queue: ObjectId[];
    pausedTimestamp: number | null;
};

export type WorkerCollectionType = WithMongoId<{
    lastCheckinTime: number;
    startTime: number;
    checkinFrequency: number;
}>;

export const mongo = client.connect().then((client) => {
    const db = client.db('audio-hq-new');
    return {
        client,
        db,
        workspaces: db.collection<WorkspaceCollectionType>('workspaces'),
        jobs: db.collection<JobsCollectionType>('jobs'),
        entries: db.collection<EntriesCollectionType>('entries'),
        decks: db.collection<DecksCollectionType>('decks'),
        workers: db.collection<WorkerCollectionType>('workers'),
    };
});
