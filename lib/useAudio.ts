import { PlayState } from './Workspace';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FileManagerContext } from './useFileManager';
import { useRecoilState, useRecoilValue } from 'recoil';
import { globalVolumeAtom } from './atoms';
import AudioContextContext from './AudioContextContext';

interface AudioInfo {
    duration: number;
    volume: number;
    time: number;
    paused: boolean;
    loading: boolean;
    blocked: boolean;
    transitioning: boolean;
}

interface Options {
    loop?: boolean;
    overrideVolume?: number;
    onFinish?: () => void;
}

const isiOS = () =>
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) ||
    (navigator.userAgent.match(/Safari/) && !navigator.userAgent.match(/Chrome/) && navigator.maxTouchPoints > 0);

const useAudio = (state: PlayState | null, { loop, overrideVolume, onFinish }: Options = {}): AudioInfo => {
    loop = loop ?? true;
    const fileManager = useContext(FileManagerContext);
    const globalVolume = useRecoilValue(globalVolumeAtom);

    const { context, blocked } = useContext(AudioContextContext);

    const [gainNode, setGainNode] = useState(context.createGain());
    gainNode.connect(context.destination);

    const [audioBufferSource, setAudioBufferSource] = useState(context.createBufferSource());
    audioBufferSource.connect(gainNode);

    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

    const [volumeValue, setVolume] = useState(0);
    const [timeValue, setTime] = useState(0); // calculate later
    const [duration, setDuration] = useState(0); // calculate later
    const [paused, setPaused] = useState(true);
    const [transitioning, setTransitioning] = useState(false);

    const handle = useRef<number | null>(null);
    const idRef = useRef(''); // used to prevent race conditions with loading many tracks.
    const loadingRef = useRef(true);

    const shadowPaused = globalVolume === 0;

    const stopRef = useRef<any>();
    const startRef = useRef<any>();

    if (!state) return { duration: 0, paused: true, time: 0, volume: 0, loading: true, blocked, transitioning: true };

    const getSeek = useCallback(() => {
        if (!state.startTimestamp || !duration) return null;
        const timeElapsedMs = ((state.pauseTime ?? Date.now()) - state.startTimestamp) * state.speed;
        if (timeElapsedMs > duration * 1000 && !loop) {
            return duration;
        }
        return (timeElapsedMs % (duration * 1000)) / 1000;
    }, [state.startTimestamp, duration, state.speed, state.pauseTime]);

    const stop = useCallback((): GainNode => {
        let curGain = gainNode;
        try {
            console.log('Stop called.', state.transitions);
            audioBufferSource.stop(context.currentTime + state.transitions);
            gainNode.gain.cancelAndHoldAtTime(context.currentTime);
            gainNode.gain.setValueAtTime((overrideVolume ?? state.volume) * globalVolume, context.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, context.currentTime + state.transitions);
            curGain = context.createGain();
            curGain.connect(context.destination);

            setGainNode(curGain);
        } catch (e) {
            console.warn(e);
        }
        return curGain;
    }, [gainNode, audioBufferSource, state.transitions]);
    stopRef.current = stop;

    const start = useCallback(
        (curGain: GainNode) => {
            const newSource = context.createBufferSource();
            newSource.buffer = audioBuffer;
            newSource.connect(curGain);
            // TODO: getSeek in seconds...?
            newSource.start(0, getSeek() ?? undefined);
            if (state.transitions) {
                console.log('Fading in...!');
                curGain.gain.cancelAndHoldAtTime(context.currentTime);
                curGain.gain.setValueAtTime(0, context.currentTime);
                curGain.gain.linearRampToValueAtTime(
                    (overrideVolume ?? state.volume) * globalVolume,
                    context.currentTime + state.transitions,
                );
            }
            setAudioBufferSource(newSource);
        },
        [audioBuffer, getSeek, state.transitions, globalVolume, state.volume],
    );
    startRef.current = start;

    useEffect(() => {
        return () => {
            console.log('onDismount effect ran');
            stopRef.current();
        };
    }, []);

    useEffect(() => {
        audioBufferSource.onended = () => {
            if (!loop) {
                onFinish?.();
            }
        };
    }, [audioBufferSource, onFinish, loop]);

    useEffect(() => {
        audioBufferSource.loop = loop ?? true;
    }, [audioBufferSource, loop]);

    useEffect(() => {
        handle.current = window.setInterval(() => {
            setTime(getSeek() ?? 0);
        }, 500);

        return () => {
            if (handle.current) window.clearInterval(handle.current);
            handle.current = null;
        };
    }, [getSeek]);

    useEffect(() => {
        console.log('Track getter called', context, state);

        idRef.current = state.id;
        loadingRef.current = true;

        if (!state.transitions) {
            console.log('STOPPING!');
            stopRef.current();
        }

        fileManager.track(state.id, async (cached) => {
            console.log('AudioBuffer decoding...');
            const audioBuffer = await context.decodeAudioData(cached);
            console.log('AudioBuffer done decoding.');
            if (idRef.current === state.id) {
                if (state.transitions) {
                    setTransitioning(true);
                    window.setTimeout(() => setTransitioning(false), state.transitions * 1000);
                }
                setDuration(audioBuffer.duration);
                loadingRef.current = false;
                setAudioBuffer(audioBuffer);
            }
        });
    }, [state.id]);

    useEffect(() => {
        if (!loadingRef.current) {
            console.log('Play/pauser called');

            setPaused(state.pauseTime !== null);
            if (state.pauseTime === null) {
                startRef.current(stopRef.current());
            } else {
                stopRef.current();
            }
            setTime(getSeek() ?? 0);
        }
    }, [loadingRef.current, state.pauseTime, getSeek]);

    useEffect(() => {
        if (!loadingRef.current && !transitioning) {
            console.log('Volume setter called');

            setGainNode((gainNode) => {
                gainNode.gain.setValueAtTime((overrideVolume ?? state.volume) * globalVolume, context.currentTime);
                return gainNode;
            });

            setVolume(overrideVolume ?? state.volume);
        }
    }, [state.volume, globalVolume, loadingRef.current, transitioning]);

    useEffect(() => {
        if (!loadingRef.current) {
            audioBufferSource.playbackRate.setValueAtTime(state.speed, context.currentTime);
        }
    }, [audioBufferSource, state.speed, loadingRef.current]);

    // auto-pause when globalVolume is 0 to pretend to the browser that we're paused.
    // useEffect(() => {
    //     if (shadowPaused) {
    //         audio.pause();
    //     } else {
    //         if (!loading && !blocked && !paused) {
    //             if (state.startTimestamp) {
    //                 audio.currentTime = getSeek()!;
    //             }
    //             audio.play();
    //         }
    //     }
    // }, [shadowPaused]);

    return {
        duration,
        paused,
        time: timeValue,
        volume: volumeValue,
        loading: loadingRef.current,
        blocked,
        transitioning,
    };
};

export default useAudio;
