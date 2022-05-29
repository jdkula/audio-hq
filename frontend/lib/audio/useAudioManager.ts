import { useCallback, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { globalVolumeAtom } from '../atoms';
import useFileManager from '../useFileManager';
import { Track } from './track';
import { Play_Status_Type_Enum_Enum } from '../generated/graphql';
import { Play_Status_Minimum } from '../graphql_type_helper';
import { useWorkspaceStatuses } from '../utility';

const useAudioManager = (() => {
    // <== Static Members ==>
    const AudioContext = window.AudioContext ?? window.webkitAudioContext;
    const ac = new AudioContext();
    ac.onstatechange = () => console.log(ac.state);

    const masterGain = ac.createGain();
    masterGain.connect(ac.destination);

    // <== Static Functions ==>

    return (workspaceId: string) => {
        // <== Local State ==>
        const fileManager = useFileManager(workspaceId);

        const { main, ambience, sfx } = useWorkspaceStatuses(workspaceId);

        const globalVolume = useRecoilValue(globalVolumeAtom);
        const mainTrack = useRef<Track | null>(null);
        const ambientTracks = useRef<Track[]>([]);

        const [blocked, setBlocked] = useState(false);

        // <== Private Functions ==>

        const unblock = useCallback(() => {
            ac.resume();
            setBlocked(false);
            document.removeEventListener('click', unblock);
        }, []);

        const onFinish = useCallback((state: Play_Status_Minimum, track: Track) => {
            if (state.type === 'sfx') {
            }
        }, []);

        const createTrack = useCallback(
            (state: Play_Status_Minimum) => {
                const tr: Track = new Track(state, fileManager, ac, state.type !== Play_Status_Type_Enum_Enum.Sfx);
                tr.on('loop', onFinish);
                tr.on('next', onFinish);
                tr.on('blocked', () => setBlocked(true));
                tr.connect(masterGain);
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
                mainTrack.current?.play();
            }
        }, [blocked, main?.pause_timestamp]);

        // useEffect(() => {
        //     if (ac.current.state === 'suspended') {
        //         // need interaction first
        //         setBlocked(true);
        //     }
        // }, []);

        useEffect(() => {
            if (main && main.queue.length > 0) {
                // TODO: Code smell...
                if (main && mainTrack.current?.reconcile(main)) {
                    return;
                }

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

        useEffect(() => {
            // TODO: Shadow pausing
            masterGain.gain.value = globalVolume;
            if (globalVolume === 0 && ac.state === 'running') {
                mainTrack.current?.pause();
                for (const track of ambientTracks.current) {
                    track.pause();
                }
                ac.suspend();
            } else if (ac.state === 'suspended') {
                ac.resume();
                mainTrack.current?.rereconcile();
                for (const track of ambientTracks.current) {
                    track.rereconcile();
                }
            }
        }, [globalVolume]);

        return {
            blocked,
        };
    };
})();

export default useAudioManager;
