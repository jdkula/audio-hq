import { resolve } from 'dns';
import { useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { globalVolumeAtom } from './atoms';
import { Workspace, WorkspaceResolver } from './Workspace';

const useMediaSession = (workspace: Workspace | null, resolver: WorkspaceResolver): void => {
    const [globalVolume, setGlobalVolume] = useRecoilState(globalVolumeAtom);
    const previousVolumeValue = useRef<number | null>(null);

    const currentlyPlaying = workspace?.files.find((file) => file.id === workspace.state.playing?.id);

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentlyPlaying?.name ?? 'Nothing Playing',
                artist: `Audio HQ - ${workspace}`,
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
                resolver({ playing: null });
            });

            navigator.mediaSession.setActionHandler('play', () => {
                if (globalVolume === 0) {
                    setGlobalVolume(previousVolumeValue.current ?? 1);
                }
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                resolver({ playing: { startTimestamp: Date.now(), pauseTime: null } });
            });
        }
    }, [resolve, globalVolume, setGlobalVolume]);
};

export default useMediaSession;
