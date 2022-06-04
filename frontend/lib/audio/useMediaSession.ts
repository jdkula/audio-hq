/**
 * useMediaSession.ts
 * ===================
 * Provides a hook to manage the navigator's audio session using
 * data from this workspace
 */
import { useContext, useEffect, useRef } from 'react';
import { kDefaultVolume } from '../constants';
import { useLocalReactiveValue } from '../LocalReactive';
import { File_Minimum } from '../urql/graphql_type_helper';
import { useWorkspaceDecks } from '../useWorkspaceDetails';
import { WorkspaceNameContext } from '../utility/context';
import { globalVolumeLRV } from '../utility/usePersistentData';
import { getTrackInfo } from './util';

const useMediaSession = (workspaceId: string): void => {
    const workspaceName = useContext(WorkspaceNameContext);
    const { main } = useWorkspaceDecks(workspaceId);

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

            navigator.mediaSession.setActionHandler('play', () => {
                if (globalVolume === 0) {
                    setGlobalVolume(previousVolumeValue.current ?? kDefaultVolume);
                }
            });
        }
    }, [main, globalVolume, setGlobalVolume]);
};

export default useMediaSession;
