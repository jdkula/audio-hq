import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useEffect, useMemo, useRef } from 'react';
import AudioHQApiContext from './context';
import {
    Deck,
    Job,
    JobCreate,
    Entry,
    WorkspaceMutate,
    DeckUpdate,
    DeckCreate,
    EntryMutate,
    SingleMutate,
    Single,
} from 'common/src/api/models';
import { v4 as uuid, v4 } from 'uuid';

export function useWorkspaceEntries(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    const key = useMemo(() => ['workspace', workspaceId, 'entries'], [workspaceId]);
    const queryClient = useQueryClient();

    const res = useQuery(key, {
        queryFn: () => api.workspace(workspaceId).entries.list(),
        refetchInterval: 300_000,
        staleTime: 10000,
    });

    useEffect(() => {
        api.workspace(workspaceId).addEntriesListiner((decks) => {
            queryClient.setQueryData(key, decks);
        });
    }, [workspaceId, queryClient, key, api]);

    return res;
}

export function useWorkspaceJobs(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    const queryClient = useQueryClient();

    const lastNumJobs = useRef(0);
    const tracksQueryKey = useMemo(() => ['workspace', workspaceId, 'entries'], [workspaceId]);
    const key = useMemo(() => ['workspace', workspaceId, 'jobs'], [workspaceId]);

    const res = useQuery(key, {
        queryFn: () => api.workspace(workspaceId).jobs.list(),
        onSuccess: (jobData) => {
            if (jobData.length < lastNumJobs.current) {
                queryClient.invalidateQueries({ queryKey: tracksQueryKey });
                queryClient.refetchQueries({ queryKey: tracksQueryKey });
            }
            lastNumJobs.current = jobData.length;
        },
        refetchInterval: 300_000,
    });

    useEffect(() => {
        api.workspace(workspaceId).addJobsListener((jobs) => {
            queryClient.setQueryData(key, jobs);
        });
    }, [workspaceId, queryClient, key, api]);

    return res;
}

export function useCreateUploadJob(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    const queryClient = useQueryClient();
    const jobsQueryKey = ['workspace', workspaceId, 'jobs'];

    const mt = useMutation({
        mutationFn: ({ file, info }: { file: Blob; info: JobCreate }) => {
            return api.workspace(workspaceId).jobs.upload(file, info);
        },
        onMutate: async ({ info }) => {
            await queryClient.cancelQueries({ queryKey: jobsQueryKey });
            const optimisticJob: Job = {
                id: uuid(),
                assignedWorker: null,
                ...info,
                progress: 0,
                status: 'getting ready',
            };

            queryClient.setQueryData(jobsQueryKey, (data?: Job[]) => [...(data ?? []), optimisticJob]);

            return { optimisticJob };
        },
        onSuccess: (res, _, ctx) => {
            queryClient.setQueryData(
                jobsQueryKey,
                (data?: Job[]) => data?.map((job) => (job.id === ctx?.optimisticJob.id ? res : job)),
            );
        },
        onError: (_, __, ctx) => {
            queryClient.setQueryData(
                jobsQueryKey,
                (data?: Job[]) => data?.filter((job) => job.id !== ctx?.optimisticJob.id),
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: jobsQueryKey });
        },
    });

    return mt;
}

export function useCreateImportJob(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    const queryClient = useQueryClient();
    const jobsQueryKey = ['workspace', workspaceId, 'jobs'];

    const mt = useMutation({
        mutationFn: ({ url, info }: { url: string; info: JobCreate }) => {
            return api.workspace(workspaceId).jobs.submit(url, info);
        },
        onMutate: async ({ info }) => {
            await queryClient.cancelQueries({ queryKey: jobsQueryKey });
            const optimisticJob: Job = {
                id: uuid(),
                assignedWorker: null,
                ...info,
                progress: 0,
                status: 'getting ready',
            };

            queryClient.setQueryData(jobsQueryKey, (data?: Job[]) => [...(data ?? []), optimisticJob]);

            return { optimisticJob };
        },
        onSuccess: (res, _, ctx) => {
            queryClient.setQueryData(
                jobsQueryKey,
                (data?: Job[]) => data?.map((job) => (job.id === ctx?.optimisticJob.id ? res : job)),
            );
        },
        onError: (_, __, ctx) => {
            queryClient.setQueryData(
                jobsQueryKey,
                (data?: Job[]) => data?.filter((job) => job.id !== ctx?.optimisticJob.id),
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: jobsQueryKey });
        },
    });

    return mt;
}

export function useDeleteEntryMutation(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    const queryClient = useQueryClient();
    const trackQueryKey = ['workspace', workspaceId, 'entries'];

    const mt = useMutation({
        mutationFn: ({ entry }: { entry: Entry }) => {
            return api.workspace(workspaceId).entry(entry).delete();
        },
        onMutate: async ({ entry }) => {
            await queryClient.cancelQueries({ queryKey: trackQueryKey });

            const deletedEntry = queryClient.getQueryData<Entry[]>(trackQueryKey)?.find((tr) => tr.id === entry.id);

            queryClient.setQueryData(trackQueryKey, (data?: Entry[]) => data?.filter((tr) => tr.id !== entry.id));

            return { deletedEntry: deletedEntry };
        },
        onError: (_, __, ctx) => {
            if (ctx?.deletedEntry) {
                const deletedEntry = ctx?.deletedEntry;
                queryClient.setQueryData(trackQueryKey, (data?: Entry[]) => [...(data ?? []), deletedEntry]);
            }
        },
    });

    return mt;
}

export function useWorkspaceDecks(workspaceId: string): {
    main: Deck | null;
    ambience: Deck[];
    sfx: Deck[];
} {
    const api = useContext(AudioHQApiContext);
    const entries = useWorkspaceEntries(workspaceId);
    const queryClient = useQueryClient();
    const key = useMemo(() => ['workspace', workspaceId, 'decks'], [workspaceId]);
    const entriesKey = useMemo(() => ['workspace', workspaceId, 'entries'], [workspaceId]);

    const { data } = useQuery({
        queryKey: key,
        queryFn: () =>
            api.workspace(workspaceId).decks.listAll(entries.data?.filter((x): x is Single => x.type === 'single')),
        refetchInterval: 60_000,
    });

    const main = useMemo(() => data?.filter((x) => x.type === 'main')[0] ?? null, [data]);
    const ambience = useMemo(() => data?.filter((x) => x.type === 'ambient') ?? [], [data]);
    const sfx = useMemo(() => data?.filter((x) => x.type === 'sfx') ?? [], [data]);

    useEffect(() => {
        api.workspace(workspaceId).addDecksListener(
            (decks) => {
                queryClient.setQueryData(key, decks);
            },
            () => queryClient.getQueryData(entriesKey),
        );
    }, [workspaceId, queryClient, key, api, entriesKey]);

    return useMemo(() => ({ main, ambience, sfx }), [main, ambience, sfx]);
}

export function useWorkspaceDetail(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    return useQuery({
        queryKey: ['workspace', workspaceId],
        queryFn: () => api.workspace(workspaceId).get(),
        refetchInterval: false,
    });
}
export function useWorkspaceDetailByName(name: string) {
    const api = useContext(AudioHQApiContext);
    return useQuery({
        queryKey: ['workspaceByName', name],
        queryFn: () => api.searchWorkspaces(name),
    });
}

export function useCreateWorkspaceMutation() {
    const api = useContext(AudioHQApiContext);
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ workspace }: { workspace: WorkspaceMutate }) => api.workspaces.create(workspace),
        onMutate: async ({ workspace }) => {
            await queryClient.cancelQueries(['workspaceByName', workspace.name]);
        },
        onSuccess: (workspace) => {
            queryClient.setQueryData(['workspaceByName', workspace.name], () => workspace);
            queryClient.setQueryData(['workspace', workspace.id], () => workspace);
        },
        onSettled: (_, __, { workspace }) => {
            queryClient.invalidateQueries({ queryKey: ['workspaceByName', workspace.name] });
        },
    });
}

export function useUpdateDeckMutation(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    const queryClient = useQueryClient();
    const decksQueryKey = ['workspace', workspaceId, 'decks'];

    return useMutation({
        mutationFn: ({ deckId, update }: { deckId: string; update: DeckUpdate }) => {
            return api.workspace(workspaceId).deck(deckId).update(update);
        },
        onMutate: async ({ deckId, update }) => {
            await queryClient.cancelQueries(decksQueryKey);
            const originalData = queryClient.getQueryData<Deck[]>(decksQueryKey)?.find((dk) => dk.id === deckId);
            queryClient.setQueryData(
                decksQueryKey,
                (decks?: Deck[]) =>
                    decks?.map((dk) =>
                        dk.id === deckId
                            ? {
                                  ...dk,
                                  ...update,
                              }
                            : dk,
                    ),
            );

            return { originalData };
        },
        onSuccess: (result, { deckId }) => {
            queryClient.setQueryData(
                decksQueryKey,
                (decks?: Deck[]) => decks?.map((dk) => (dk.id === deckId ? result : dk)),
            );
        },
        onError: (_, { deckId }, ctx) => {
            if (ctx?.originalData) {
                const original = ctx.originalData;
                queryClient.setQueryData(
                    decksQueryKey,
                    (decks?: Deck[]) => decks?.map((dk) => (dk.id === deckId ? original : dk)),
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: decksQueryKey });
        },
    });
}

export function useDeleteJobMutation(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    const queryClient = useQueryClient();
    const jobsQueryKey = ['workspace', workspaceId, 'jobs'];

    return useMutation({
        mutationFn: ({ jobId }: { jobId: string }) => {
            return api.workspace(workspaceId).job(jobId).cancel();
        },
        onMutate: async ({ jobId }) => {
            await queryClient.cancelQueries(jobsQueryKey);
            const originalJob = queryClient.getQueryData<Job[]>(jobsQueryKey)?.find((job) => job.id === jobId);
            queryClient.setQueryData(jobsQueryKey, (jobs?: Job[]) => jobs?.filter((other) => other.id === jobId));

            return { originalJob };
        },
        onError: (_, __, ctx) => {
            if (ctx?.originalJob) {
                const orig = ctx.originalJob;
                queryClient.setQueryData(jobsQueryKey, (jobs?: Job[]) => [...(jobs ?? []), orig]);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: jobsQueryKey });
        },
    });
}

export function usePlayDeckMutation(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    const queryClient = useQueryClient();
    const decksQueryKey = ['workspace', workspaceId, 'decks'];

    return useMutation({
        mutationFn: ({ deck }: { deck: DeckCreate }) => {
            return api.workspace(workspaceId).decks.create(deck);
        },
        onMutate: async ({ deck }) => {
            await queryClient.cancelQueries(decksQueryKey);
            const optimisticDeck: Deck = {
                ...deck,
                createdAt: new Date(),
                id: uuid(),
            };

            if (optimisticDeck.type === 'main') {
                queryClient.setQueryData<Deck[]>(decksQueryKey, (decks) => [
                    ...(decks?.filter((deck) => deck.type !== 'main') ?? []),
                    optimisticDeck,
                ]);
            } else {
                queryClient.setQueryData<Deck[]>(decksQueryKey, (decks) => [...(decks ?? []), optimisticDeck]);
            }

            return { optimisticDeck };
        },
        onSuccess: (realDeck, _, ctx) => {
            if (ctx?.optimisticDeck) {
                const optimistic = ctx.optimisticDeck;
                queryClient.setQueryData<Deck[]>(decksQueryKey, (decks) => [
                    ...(decks?.filter((other) => other.id !== optimistic.id) ?? []),
                    realDeck,
                ]);
            } else if (realDeck.type === 'main') {
                queryClient.setQueryData<Deck[]>(decksQueryKey, (decks) => [
                    ...(decks?.filter((other) => other.type !== 'main') ?? []),
                    realDeck,
                ]);
            } else {
                queryClient.setQueryData<Deck[]>(decksQueryKey, (decks) => [...(decks ?? []), realDeck]);
            }
        },
        onError: (_, __, ctx) => {
            if (ctx?.optimisticDeck) {
                const optimistic = ctx.optimisticDeck;
                queryClient.setQueryData<Deck[]>(
                    decksQueryKey,
                    (decks) => decks?.filter((other) => other.id !== optimistic.id),
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: decksQueryKey });
        },
    });
}

export function useUpdateEntryMutation(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    const queryClient = useQueryClient();
    const entryQueryKey = ['workspace', workspaceId, 'entries'];

    return useMutation({
        mutationFn: ({ entry, update }: { entry: Entry; update: EntryMutate | SingleMutate }) => {
            return api.workspace(workspaceId).entry(entry).update(update);
        },
        onMutate: async ({ entry, update }) => {
            await queryClient.cancelQueries(entryQueryKey);
            const original = queryClient.getQueryData<Entry[]>(entryQueryKey)?.find((tr) => tr.id === entry.id);

            if (!original) return {};

            const optimistic: Entry = {
                ...original,
                ...update,
                ordering: (update.ordering === null ? Number.POSITIVE_INFINITY : update.ordering) ?? original.ordering,
            };

            queryClient.setQueryData<Entry[]>(
                entryQueryKey,
                (entries) => entries?.map((tr) => (tr.id === entry.id ? optimistic : tr)),
            );
            return { original, optimistic };
        },
        onSuccess: (track) => {
            queryClient.setQueryData<Entry[]>(
                entryQueryKey,
                (tracks) => tracks?.map((tr) => (tr.id === track.id ? track : tr)),
            );
        },
        onError: (_, { entry }, ctx) => {
            if (ctx?.original) {
                const original = ctx.original;

                queryClient.setQueryData<Entry[]>(
                    entryQueryKey,
                    (tracks) => tracks?.map((tr) => (tr.id === entry.id ? original : tr)),
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: entryQueryKey });
        },
    });
}

export function useStopDeckMutation(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    const queryClient = useQueryClient();
    const decksQueryKey = ['workspace', workspaceId, 'decks'];

    return useMutation({
        mutationFn: ({ deckId }: { deckId: string }) => {
            return api.workspace(workspaceId).deck(deckId).delete();
        },
        onMutate: async ({ deckId }) => {
            await queryClient.cancelQueries(decksQueryKey);
            const original = queryClient.getQueryData<Deck[]>(decksQueryKey)?.find((dk) => dk.id === deckId);
            queryClient.setQueryData<Deck[]>(decksQueryKey, (decks) => decks?.filter((dk) => dk.id !== deckId));

            return { original };
        },
        onError: (_, __, ctx) => {
            if (!ctx?.original) return;
            const original = ctx.original;
            queryClient.setQueryData<Deck[]>(decksQueryKey, (decks) => [...(decks ?? []), original]);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: decksQueryKey });
        },
    });
}

export function useCreateFolderMutation(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    const queryClient = useQueryClient();
    const entriesQueryKey = ['workspace', workspaceId, 'entries'];

    const mt = useMutation({
        mutationFn: ({ name, basePath, ordering }: { name: string; basePath: string[]; ordering?: number }) => {
            return api.workspace(workspaceId).entries.createFolder(name, basePath, ordering);
        },
        onMutate: async ({ name, basePath, ordering }) => {
            await queryClient.cancelQueries({ queryKey: entriesQueryKey });

            const optimisticId = v4();
            queryClient.setQueryData(entriesQueryKey, (data?: Entry[]) => [
                ...(data ?? []),
                {
                    type: 'folder' as const,
                    id: optimisticId,
                    name,
                    path: basePath,
                    ordering: ordering ?? Number.POSITIVE_INFINITY,
                },
            ]);

            return { optimisticId };
        },
        onError: (_, __, ctx) => {
            if (ctx?.optimisticId) {
                const optimisticId = ctx.optimisticId;
                queryClient.setQueryData(
                    entriesQueryKey,
                    (data?: Entry[]) => data?.filter((ent) => ent.id === optimisticId),
                );
            }
        },
    });

    return mt;
}
