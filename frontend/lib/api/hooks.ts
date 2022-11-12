import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import AudioHQApiContext from './context';
import { Deck, Job, JobCreate, Track, WorkspaceCreate, DeckUpdate, DeckCreate, TrackUpdate } from './models';
import { v4 as uuid } from 'uuid';

export function useWorkspaceTracks(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    return useQuery(['workspace', workspaceId, 'tracks'], {
        queryFn: () => api.workspace(workspaceId).tracks.list(),
        refetchInterval: 15000,
        staleTime: 10000,
    });
}

export function useWorkspaceJobs(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    return useQuery(['workspace', workspaceId, 'jobs'], {
        queryFn: () => api.workspace(workspaceId).jobs.list(),
    });
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
            queryClient.setQueryData(jobsQueryKey, (data?: Job[]) =>
                data?.map((job) => (job.id === ctx?.optimisticJob.id ? res : job)),
            );
        },
        onError: (_, __, ctx) => {
            queryClient.setQueryData(jobsQueryKey, (data?: Job[]) =>
                data?.filter((job) => job.id !== ctx?.optimisticJob.id),
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
            queryClient.setQueryData(jobsQueryKey, (data?: Job[]) =>
                data?.map((job) => (job.id === ctx?.optimisticJob.id ? res : job)),
            );
        },
        onError: (_, __, ctx) => {
            queryClient.setQueryData(jobsQueryKey, (data?: Job[]) =>
                data?.filter((job) => job.id !== ctx?.optimisticJob.id),
            );
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: jobsQueryKey });
        },
    });

    return mt;
}

export function useDeleteTrackMutation(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    const queryClient = useQueryClient();
    const trackQueryKey = ['workspace', workspaceId, 'track'];

    const mt = useMutation({
        mutationFn: ({ id }: { id: string }) => {
            return api.workspace(workspaceId).track(id).delete();
        },
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: trackQueryKey });

            const deletedTrack = queryClient.getQueryData<Track[]>(trackQueryKey)?.find((tr) => tr.id === id);

            queryClient.setQueryData(trackQueryKey, (data?: Track[]) => data?.filter((tr) => tr.id !== id));

            return { deletedTrack };
        },
        onError: (_, __, ctx) => {
            if (ctx?.deletedTrack) {
                const deletedTrack = ctx?.deletedTrack;
                queryClient.setQueryData(trackQueryKey, (data?: Track[]) => [...(data ?? []), deletedTrack]);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: trackQueryKey });
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
    const { data } = useQuery({
        queryKey: ['workspace', workspaceId, 'decks'],
        queryFn: () => api.workspace(workspaceId).decks.listAll(),
        refetchInterval: 1000,
    });

    const main = data?.filter((x) => x.type === 'main')[0] ?? null;
    const ambience = data?.filter((x) => x.type === 'ambient') ?? [];
    const sfx = data?.filter((x) => x.type === 'sfx') ?? [];

    return { main, ambience, sfx };
}

export function useWorkspaceDetail(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    return useQuery({
        queryKey: ['workspace', workspaceId],
        queryFn: () => api.workspace(workspaceId).get(),
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
        mutationFn: ({ workspace }: { workspace: WorkspaceCreate }) => api.workspaces.create(workspace),
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
            queryClient.setQueryData(decksQueryKey, (decks?: Deck[]) =>
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
            queryClient.setQueryData(decksQueryKey, (decks?: Deck[]) =>
                decks?.map((dk) => (dk.id === deckId ? result : dk)),
            );
        },
        onError: (_, { deckId }, ctx) => {
            if (ctx?.originalData) {
                const original = ctx.originalData;
                queryClient.setQueryData(decksQueryKey, (decks?: Deck[]) =>
                    decks?.map((dk) => (dk.id === deckId ? original : dk)),
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
                queryClient.setQueryData<Deck[]>(decksQueryKey, (decks) =>
                    decks?.filter((other) => other.id !== optimistic.id),
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: decksQueryKey });
        },
    });
}

export function useUpdateTrackMutation(workspaceId: string) {
    const api = useContext(AudioHQApiContext);
    const queryClient = useQueryClient();
    const tracksQueryKey = ['workspace', workspaceId, 'tracks'];

    return useMutation({
        mutationFn: ({ trackId, update }: { trackId: string; update: TrackUpdate }) => {
            return api.workspace(workspaceId).track(trackId).update(update);
        },
        onMutate: async ({ trackId, update }) => {
            await queryClient.cancelQueries(tracksQueryKey);
            const original = queryClient.getQueryData<Track[]>(tracksQueryKey)?.find((tr) => tr.id === trackId);

            if (!original) return {};

            const optimistic: Track = {
                ...original,
                ...update,
                ordering: (update.ordering === null ? Number.POSITIVE_INFINITY : update.ordering) ?? original.ordering,
            };

            queryClient.setQueryData<Track[]>(tracksQueryKey, (tracks) =>
                tracks?.map((tr) => (tr.id === trackId ? optimistic : tr)),
            );
            return { original, optimistic };
        },
        onSuccess: (track) => {
            queryClient.setQueryData<Track[]>(tracksQueryKey, (tracks) =>
                tracks?.map((tr) => (tr.id === track.id ? track : tr)),
            );
        },
        onError: (_, { trackId }, ctx) => {
            if (ctx?.original) {
                const original = ctx.original;

                queryClient.setQueryData<Track[]>(tracksQueryKey, (tracks) =>
                    tracks?.map((tr) => (tr.id === trackId ? original : tr)),
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: tracksQueryKey });
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
