import Job from './Job';

if (typeof global !== 'undefined' && !global.__PROC_CACHE) {
    global.__PROC_CACHE = new Map();
}

export default class Jobs {
    static get(id: string): Job | null {
        return global.__PROC_CACHE?.get(id) ?? null;
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
            global.__PROC_CACHE?.delete(id);
        } else {
            global.__PROC_CACHE?.set(id, job);
        }
        return job;
    }

    static has(id: string): boolean {
        return global.__PROC_CACHE?.has(id) ?? false;
    }

    static ofWorkspace(id: string): Job[] {
        const jobs: Job[] = [];
        for (const job of global.__PROC_CACHE?.values() ?? []) {
            if (job.workspace === id) jobs.push(job);
        }

        return jobs;
    }
}
