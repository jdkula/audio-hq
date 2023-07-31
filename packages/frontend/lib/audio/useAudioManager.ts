/**
 * useAudioManager.ts
 * ===================
 * Provides all the acutal audio that plays in Audio HQ.
 * Manages all their state using information retrieved from the server.
 */
import { useCallback, useEffect, useRef, useState, useContext } from 'react';
import { Deck } from './deck';
import { FileManagerContext } from '../utility/context';
import * as API from 'common/src/api/models';
import { useWorkspaceDecks } from '../api/hooks';

export default function useAudioManager(workspaceId: string) {
    // <== Local State ==>
    const fileManager = useContext(FileManagerContext);

    const { main, ambience, sfx } = useWorkspaceDecks(workspaceId);

    const mainTrack = useRef<Deck | null>(null);
    const ambientTracks = useRef<Deck[]>([]);

    const [blocked, setBlocked] = useState(false);

    // <== Private Functions ==>

    const unblock = useCallback(() => {
        setBlocked(false);
        document.removeEventListener('click', unblock);
    }, []);

    const createTrack = useCallback(
        (state: API.Deck) => {
            const tr: Deck = new Deck(state, fileManager);
            tr.on('blocked', () => setBlocked(true));
            return tr;
        },
        [fileManager],
    );

    // <== Data Effects ==>

    useEffect(() => {
        return () => {
            mainTrack.current?.destroy();
            // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if (!blocked && !main?.pauseTimestamp) {
            mainTrack.current?.unblock();
        }
    }, [blocked, main?.pauseTimestamp]);

    useEffect(() => {
        if (main && main.queue.length > 0) {
            if (main && mainTrack.current?.reconcile(main)) {
                return;
            }

            const old = mainTrack.current;
            old?.disownTracks();
            mainTrack.current = createTrack(main);

            if (old) {
                old.destroy();
            }
        } else if (!main) {
            mainTrack.current?.destroy();
            mainTrack.current = null;
        }
        Deck.pruneCache();
    }, [fileManager, main, createTrack]);

    useEffect(() => {
        const toDestroy: Deck[] = [];
        for (let i = ambientTracks.current.length - 1; i >= 0; i--) {
            const deck = ambientTracks.current[i];
            const matchedState = [...ambience, ...sfx].find((deckDef) => deck.isReferentFor(deckDef));
            if (!matchedState || !deck.reconcile(matchedState)) {
                toDestroy.push(deck);
                ambientTracks.current.splice(i, 1);
            }
        }

        for (const deck of toDestroy) {
            deck.disownTracks();
        }

        for (const amb of [...ambience, ...sfx]) {
            const matchedTrack = ambientTracks.current.find((track) => track.isReferentFor(amb));
            if (!matchedTrack) {
                const tr = createTrack(amb);
                ambientTracks.current.push(tr);
            }
        }

        Deck.pruneCache();
    }, [ambience, sfx, fileManager, createTrack]);

    return {
        blocked,
    };
}
