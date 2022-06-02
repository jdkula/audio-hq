import { useCallback, useEffect, useRef, useState } from 'react';
import useFileManager from '../useFileManager';
import { Deck } from './deck';
import { Deck_Minimum } from '../graphql_type_helper';
import { useWorkspaceDecks } from '../utility';

const useAudioManager = (() => {
    // <== Static Members ==>
    let initialized = false;

    // <== Static Functions ==>

    return (workspaceId: string) => {
        // <== SSR Static Initialization ==>
        useEffect(() => {
            if (initialized) return;
            initialized = true;
        }, []);

        // <== Local State ==>
        const fileManager = useFileManager(workspaceId);

        const { main, ambience, sfx } = useWorkspaceDecks(workspaceId);

        const mainTrack = useRef<Deck | null>(null);
        const ambientTracks = useRef<Deck[]>([]);

        const [blocked, setBlocked] = useState(false);

        // <== Private Functions ==>

        const unblock = useCallback(() => {
            setBlocked(false);
            document.removeEventListener('click', unblock);
        }, []);

        const onFinish = useCallback((state: Deck_Minimum, track: Deck) => {
            if (state.type === 'sfx') {
            }
        }, []);

        const createTrack = useCallback(
            (state: Deck_Minimum) => {
                const tr: Deck = new Deck(state, fileManager);
                tr.on('loop', onFinish);
                tr.on('next', onFinish);
                tr.on('blocked', () => setBlocked(true));
                return tr;
            },
            [fileManager, onFinish],
        );

        // <== Data Effects ==>

        useEffect(() => {
            return () => {
                mainTrack.current?.destroy();
                for (const track of ambientTracks.current) {
                    track.destroy();
                }
            };
        }, []);

        useEffect(() => {
            if (blocked) {
                document.addEventListener('click', unblock);
            }
        }, [unblock, blocked]);

        useEffect(() => {
            if (!blocked && !main?.pause_timestamp) {
                mainTrack.current?.unblock();
            }
        }, [blocked, main?.pause_timestamp]);

        useEffect(() => {
            if (main && main.queue.length > 0) {
                // TODO: Code smell...
                if (main && mainTrack.current?.reconcile(main)) {
                    return;
                }
                // console.log('Creating new track!');

                mainTrack.current?.destroy();
                mainTrack.current = createTrack(main);
            } else if (!main) {
                mainTrack.current?.destroy();
                mainTrack.current = null;
            }
        }, [fileManager, main, createTrack]);

        useEffect(() => {
            for (let i = ambientTracks.current.length - 1; i >= 0; i--) {
                const track = ambientTracks.current[i];
                const matchedState = [...ambience, ...sfx].find((ps) => track.isReferentFor(ps));
                if (!matchedState) {
                    track.destroy();
                    ambientTracks.current.splice(i, 1);
                } else if (!track.reconcile(matchedState)) {
                    track.destroy();
                    ambientTracks.current[i] = createTrack(matchedState);
                }
            }

            for (const amb of [...ambience, ...sfx]) {
                const matchedTrack = ambientTracks.current.find((track) => track.isReferentFor(amb));
                if (!matchedTrack) {
                    const tr = createTrack(amb);
                    ambientTracks.current.push(tr);
                }
            }
        }, [ambience, sfx, fileManager, createTrack]);

        return {
            blocked,
        };
    };
})();

export default useAudioManager;
