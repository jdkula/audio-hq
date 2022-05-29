import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { globalVolumeAtom } from '../atoms';
import {
    Play_Status_Type_Enum_Enum,
    usePlayStatusesSubscription,
    useStopTrackMutation,
    useUpdateTrackMutation,
} from '../generated/graphql';
import { getTrackInfo } from '../utility';
import { File_Minimum } from '../graphql_type_helper';

const useMediaSession = (workspaceId: string): void => {
    const [{ data: rawMainStatuses }] = usePlayStatusesSubscription({
        variables: { workspaceId, type: Play_Status_Type_Enum_Enum.Main },
    });
    const [, delTrack] = useStopTrackMutation();
    const [, updateTrack] = useUpdateTrackMutation();

    const main = rawMainStatuses?.play_status[0] ?? null;

    const [globalVolume, setGlobalVolume] = useRecoilState(globalVolumeAtom);
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
                artist: `Audio HQ - ${workspaceId ?? ''}`,
            });
        }
    }, [workspaceId, currentlyPlaying]);

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.setActionHandler('pause', () => {
                previousVolumeValue.current = globalVolume;
                setGlobalVolume(0);
            });
            navigator.mediaSession.setActionHandler('stop', () => {
                if (main) {
                    delTrack({ trackId: main.id });
                }
            });

            navigator.mediaSession.setActionHandler('play', () => {
                if (globalVolume === 0) {
                    setGlobalVolume(previousVolumeValue.current ?? 1);
                }
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                if (main) {
                    updateTrack({ trackId: main.id, update: { start_timestamp: new Date() } });
                }
            });
        }
    }, [main, globalVolume, setGlobalVolume, updateTrack, delTrack]);
};

export default useMediaSession;
