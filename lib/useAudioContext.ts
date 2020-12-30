import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { globalVolumeAtom } from './atoms';
import { WorkspaceContext } from './useWorkspace';
import { Workspace, WorkspaceResolver } from './Workspace';

const useAudioContext = (
    workspace: Workspace | null,
    resolve: WorkspaceResolver,
): { context: AudioContext; blocked: boolean } => {
    if (typeof window === 'undefined') {
        return { context: null, blocked: null } as never; // SSR
    }

    const [globalVolume, setGlobalVolume] = useRecoilState(globalVolumeAtom);
    const previousVolumeValue = useRef<number | null>(null);

    const currentlyPlaying = workspace?.files.find(
        (file) =>
            file.id === (workspace.state.playing?.id ?? workspace.state.ambience[0]?.id ?? workspace.state.sfx.sfx?.id),
    );

    const [context, setContext] = useState<AudioContext>(
        new (window.AudioContext || (window as any).webkitAudioContext)(),
    );

    const [blank, setBlank] = useState(new Audio());
    const [isBlocked, setIsBlocked] = useState(false);

    const onInteract = useCallback(() => {
        console.log('onInteract called');
        context
            ?.resume()
            .then(() => {
                console.log('onInteract -> resume() -> then called');

                setIsBlocked(false);
                clearInteractGate();
                console.log('interaction gate removed');
            })
            .catch((e) => console.warn(e));
        blank
            .play()
            .then(() => {
                if (workspace && workspace?.state.playing?.pauseTime !== null) {
                    blank.pause();
                }
            })
            .catch((e) => console.warn(e));
    }, [context]);

    const setInteractGate = useCallback(() => {
        document.addEventListener('keyup', onInteract);
        document.addEventListener('mouseup', onInteract);
    }, [onInteract]);

    const clearInteractGate = useCallback(() => {
        document.removeEventListener('keyup', onInteract);
        document.removeEventListener('mouseup', onInteract);
    }, [onInteract]);

    useEffect(() => {
        blank.src = '/silence.mp3';
        blank.loop = true;
        blank.preload = 'auto';
        if (context.state !== 'running') {
            setIsBlocked(true);
            setInteractGate();
        } else {
            blank.play();
        }
        console.log(blank);
    }, []);

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentlyPlaying?.name ?? 'Nothing Playing',
                artist: `Audio HQ - ${workspace?.name ?? ''}`,
            });

            if (
                workspace &&
                (!workspace.state.playing || workspace.state.playing.pauseTime !== null || globalVolume === 0)
            ) {
                console.log('Apparently paused!');
                blank.pause();
                navigator.mediaSession.playbackState = 'paused';
            } else {
                blank.play();
                navigator.mediaSession.playbackState = 'playing';
            }
        }
    }, [workspace, currentlyPlaying, globalVolume]);

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.setActionHandler('pause', () => {
                previousVolumeValue.current = globalVolume;
                setGlobalVolume(0);
            });
            navigator.mediaSession.setActionHandler('stop', () => {
                resolve({ playing: null });
            });

            navigator.mediaSession.setActionHandler('play', () => {
                if (globalVolume === 0) {
                    setGlobalVolume(previousVolumeValue.current ?? 1);
                }
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                resolve({ playing: { startTimestamp: Date.now(), pauseTime: null } });
            });
        }
    }, [workspace, globalVolume, setGlobalVolume]);

    return { context, blocked: isBlocked };
};

export default useAudioContext;
