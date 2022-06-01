import { useContext, useEffect, useRef } from 'react';
import { getTrackInfo, useWorkspaceDecks, WorkspaceNameContext } from '../utility';
import { File_Minimum } from '../graphql_type_helper';
import { useLocalReactiveValue } from '../local_reactive';
import { globalVolumeLRV } from '../global_lrv';
import { useStopDeckMutation, useUpdateDeckMutation } from '../generated/graphql';

const useMediaSession = (workspaceId: string): void => {
    const workspaceName = useContext(WorkspaceNameContext);
    const { main } = useWorkspaceDecks(workspaceId);
    const [, delDeck] = useStopDeckMutation();
    const [, updateDeck] = useUpdateDeckMutation();

    const [globalVolume, setGlobalVolume] = useLocalReactiveValue(globalVolumeLRV);
    const previousVolumeValue = useRef<number | null>(null);

    let currentlyPlaying: File_Minimum | null = null;
    if (main) {
        const track = getTrackInfo(main)?.file;
        if (track) {
            currentlyPlaying = track;
        }
    }

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentlyPlaying?.name ?? 'Nothing Playing',
                artist: `Audio HQ - ${workspaceName ?? ''}`,
            });
        }
    }, [workspaceId, currentlyPlaying, workspaceName]);

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.setActionHandler('pause', () => {
                previousVolumeValue.current = globalVolume;
                setGlobalVolume(0);
            });
            navigator.mediaSession.setActionHandler('stop', () => {
                if (main) {
                    delDeck({ deckId: main.id });
                }
            });

            navigator.mediaSession.setActionHandler('play', () => {
                if (globalVolume === 0) {
                    setGlobalVolume(previousVolumeValue.current ?? 1);
                }
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                if (main) {
                    updateDeck({ deckId: main.id, update: { start_timestamp: new Date() } });
                }
            });
        }
    }, [main, globalVolume, setGlobalVolume, updateDeck, delDeck]);
};

export default useMediaSession;
