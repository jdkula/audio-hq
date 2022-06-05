/**
 * useMediaSession.ts
 * ===================
 * Provides a hook to manage the navigator's audio session using
 * data from this workspace
 */
import { sub } from 'date-fns';
import { useContext, useEffect, useMemo, useRef } from 'react';
import { kDefaultVolume } from '../constants';
import { useUpdateDeckMutation } from '../generated/graphql';
import { useLocalReactiveValue } from '../LocalReactive';
import { useWorkspaceDecks } from '../useWorkspaceDetails';
import { WorkspaceNameContext } from '../utility/context';
import { globalVolumeLRV } from '../utility/usePersistentData';
import { DeckInfo, getDeckInfo } from './audio_util';

const useMediaSession = (workspaceId: string): void => {
    const workspaceName = useContext(WorkspaceNameContext);
    const { main } = useWorkspaceDecks(workspaceId);

    const [, updateDeck] = useUpdateDeckMutation();

    const [globalVolume, setGlobalVolume] = useLocalReactiveValue(globalVolumeLRV);
    const previousVolumeValue = useRef<number | null>(null);

    const currentlyPlaying: DeckInfo | null = useMemo(() => (main ? getDeckInfo(main) : null), [main]);

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentlyPlaying?.trackInfo.currentTrack.file.name ?? 'Nothing Playing',
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

            navigator.mediaSession.setActionHandler('play', () => {
                if (globalVolume === 0) {
                    setGlobalVolume(previousVolumeValue.current ?? kDefaultVolume);
                }
            });

            navigator.mediaSession.setActionHandler('previoustrack', () => {
                if (main && currentlyPlaying) {
                    updateDeck({
                        deckId: main.id,
                        update: {
                            start_timestamp: sub(new Date(), {
                                seconds: currentlyPlaying.trackInfo.startTime,
                            }).toISOString(),
                        },
                    });
                }
            });
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                if (main && currentlyPlaying) {
                    updateDeck({
                        deckId: main.id,
                        update: {
                            start_timestamp: sub(new Date(), {
                                seconds: currentlyPlaying.trackInfo.endTime,
                            }).toISOString(),
                        },
                    });
                }
            });
        }
    }, [main, globalVolume, setGlobalVolume, updateDeck, currentlyPlaying]);
};

export default useMediaSession;
