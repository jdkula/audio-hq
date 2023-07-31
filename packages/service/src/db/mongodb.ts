import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import type { audiohq } from 'common/lib/generated/proto';
import type { SelectNonNullable, NonNullableRecursive } from 'common/lib/helpers';
const uri = process.env.DB_URI as string;

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

export type WorkspaceCollectionType = WithMongoId<NonNullableRecursive<audiohq.IWorkspace, ObjectId>>;
export type JobsCollectionType = WithMongoIdWorkspace<
    SelectNonNullable<
        Omit<audiohq.IJob, 'unassigned' | 'ok' | 'assignedWorker' | 'workspace'>,
        'details' | 'status' | 'source',
        ObjectId
    >
> & { assignedWorker: ObjectId | null; assignedAt: number };
export type EntriesCollectionType = WithMongoIdWorkspace<{
    name: string;
    path: string[];
    ordering?: number | null;

    isFolder: boolean;
    single?: NonNullableRecursive<OmitId<audiohq.ISingle> & { provider_id: string; source: string }, ObjectId>;
}>;
export type DecksCollectionType = WithMongoIdWorkspace<NonNullableRecursive<Omit<audiohq.IDeck, 'queue'>, ObjectId>> & {
    queue: ObjectId[];
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
