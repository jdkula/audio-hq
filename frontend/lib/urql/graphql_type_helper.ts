/**
 * graphql_type_helper.ts
 * =======================
 * Implements some convenience types that contain all the fields we
 * query for each type, so we can pass gql results around
 */
import { Deck, File, Job, Track } from '../generated/graphql';

export type Deck_Minimum = Omit<Deck, '__typename' | 'workspace_id' | 'workspace' | 'queue' | 'created_at'> & {
    queue: Track_Minimum[];
};

export type Track_Minimum = Omit<Track, 'file' | 'deck' | 'file_id' | 'track_id' | 'created_at'> & {
    file: File_Minimum;
};

export type File_Minimum = Omit<File, 'workspace' | '__typename'>;

export type Job_Minimum = Omit<Job, 'options' | '__typename' | 'file_upload' | 'url' | 'workspace_id'>;
