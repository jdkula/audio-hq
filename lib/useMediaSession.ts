import { useRef, useEffect, useContext } from 'react';
import { useRecoilState } from 'recoil';
import { globalVolumeAtom } from './atoms';
import { FileManager } from './useFileManager';
import { WorkspaceContext, WorkspaceContextType } from './useWorkspace';
import { File, Workspace, WorkspaceResolver } from './Workspace';

const useMediaSession = (): void => {
    const workspace = useContext(WorkspaceContext);

    const [globalVolume, setGlobalVolume] = useRecoilState(globalVolumeAtom);
    const previousVolumeValue = useRef<number | null>(null);

    let currentlyPlaying: File | null = null;
    if (workspace.state.playing) {
        const track = workspace.getCurrentTrackFrom(workspace.state.playing)?.file;
        if (track) {
            currentlyPlaying = track;
        }
    }

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentlyPlaying?.name ?? 'Nothing Playing',
                artist: `Audio HQ - ${workspace?.name ?? ''}`,
            });
        }
    }, [workspace, currentlyPlaying]);

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.setActionHandler('pause', () => {
                previousVolumeValue.current = globalVolume;
                setGlobalVolume(0);
            });
            navigator.mediaSession.setActionHandler('stop', () => {
                workspace.resolver({ playing: null });
            });

            navigator.mediaSession.setActionHandler('play', () => {
                if (globalVolume === 0) {
                    setGlobalVolume(previousVolumeValue.current ?? 1);
                }
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                workspace.resolver({ playing: { startTimestamp: Date.now(), pauseTime: null } });
            });
        }
    }, [workspace.resolver, globalVolume, setGlobalVolume]);
};

export default useMediaSession;
