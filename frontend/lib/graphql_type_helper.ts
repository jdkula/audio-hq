import { File, Play_Status, Job } from './generated/graphql';

export type Play_Status_Minimum = Omit<Play_Status, '__typename' | 'workspace_id' | 'workspace' | 'queue'> & {
    queue: Queue_Entry_Minimum[];
};

export type Queue_Entry_Minimum = Omit<Play_Status['queue'][number], 'file' | 'status'> & {
    file: File_Minimum;
};

export type File_Minimum = Omit<File, 'workspace' | 'workspace_id' | '__typename'>;

export type Job_Minimum = Omit<Job, 'options' | '__typename' | 'file_upload' | 'url' | 'workspace_id'>;
