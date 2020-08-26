const g = global as { __PROC_CACHE?: Map<string, Job> };

if (!g.__PROC_CACHE) {
    g.__PROC_CACHE = new Map();
}

export default class Jobs {
    static get(id: string): Job | null {
        return g.__PROC_CACHE?.get(id) ?? null;
    }

    static set(
        id: string,
        job: Job | null | ((current: Job) => Job | null),
        defaultValue: Job | null = null,
    ): Job | null {
        if (typeof job === 'function') {
            const current = this.get(id);
            job = current ? job(current) : defaultValue;
        }
        if (job === null) {
            g.__PROC_CACHE?.delete(id);
        } else {
            g.__PROC_CACHE?.set(id, job);
        }
        return job;
    }

    static has(id: string): boolean {
        return g.__PROC_CACHE?.has(id) ?? false;
    }
}

export interface Job {
    jobId: string;
    name: string;
    status: 'started' | 'downloading' | 'converting' | 'uploading' | 'saving' | 'error' | 'done';
    progress: number | null;
    errorInfo?: string;
    result?: string;
}
