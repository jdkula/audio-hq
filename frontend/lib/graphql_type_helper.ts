import { Deck, File, Job, Track } from './generated/graphql';

export type Deck_Minimum = Omit<Deck, '__typename' | 'workspace_id' | 'workspace' | 'queue'> & {
    queue: Track_Minimum[];
};

export type Track_Minimum = Omit<Track, 'file' | 'deck'> & {
    file: File_Minimum;
};

export type File_Minimum = Omit<File, 'workspace' | '__typename'>;

export type Job_Minimum = Omit<Job, 'options' | '__typename' | 'file_upload' | 'url' | 'workspace_id'>;
