export default interface Job {
    jobId: string;
    name: string;
    workspace: string;
    status: 'started' | 'downloading' | 'converting' | 'uploading' | 'saving' | 'error' | 'done';
    progress: number | null;
    errorInfo?: string;
    result?: string;
}
