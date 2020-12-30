import { PlayState } from './Workspace';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FileManagerContext } from './useFileManager';
import { useRecoilValue } from 'recoil';
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
    const [audioBufferSource, setAudioBufferSource] = useState(context.createBufferSource());

    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

    const [volumeValue, setVolume] = useState(0);
    const [timeValue, setTime] = useState(0); // calculate later
    const [duration, setDuration] = useState(0); // calculate later
    const [paused, setPaused] = useState(true);
    const [transitioning, setTransitioning] = useState(false);

    const handle = useRef<number | null>(null);
    const idRef = useRef(''); // used to prevent race conditions with loading many tracks.
    const loadingRef = useRef(true);

    const stopRef = useRef<any>();
    const startRef = useRef<any>();
    const startedRef = useRef(false);

    if (!state) return { duration: 0, paused: true, time: 0, volume: 0, loading: true, blocked, transitioning: true };

    const getSeek = useCallback(() => {
        if (!state.startTimestamp || !duration) return null;
        const timeElapsedMs = ((state.pauseTime ?? Date.now()) - state.startTimestamp) * state.speed;
        if (timeElapsedMs > duration * 1000 && !loop) {
            return duration;
        }
        return (timeElapsedMs % (duration * 1000)) / 1000;
    }, [state.startTimestamp, duration, state.speed, state.pauseTime]);

    const stop = useCallback(
        (now?: boolean): GainNode => {
            let curGain = gainNode;
            const transition = now ? 0 : state.transitions;
            try {
                console.log('Stop called.', transition);
                audioBufferSource.stop(context.currentTime + transition);
                gainNode.gain.cancelScheduledValues(context.currentTime);
                gainNode.gain.setValueAtTime((overrideVolume ?? state.volume) * globalVolume, context.currentTime);
                gainNode.gain.linearRampToValueAtTime(0, context.currentTime + transition);
                curGain = context.createGain();
                curGain.connect(context.destination);

                setGainNode(curGain);
            } catch (e) {
                console.warn(e);
            }
            return curGain;
        },
        [gainNode, audioBufferSource, state.transitions, globalVolume],
    );
    stopRef.current = stop;

    const start = useCallback(
        (curGain: GainNode, now?: boolean) => {
            const newSource = context.createBufferSource();
            newSource.buffer = audioBuffer;
            newSource.connect(curGain);
            if (state.transitions && !now) {
                console.log('Fading in...!');
                curGain.gain.cancelScheduledValues(context.currentTime);
                curGain.gain.setValueAtTime(0, context.currentTime);
                curGain.gain.linearRampToValueAtTime(
                    (overrideVolume ?? state.volume) * globalVolume,
                    context.currentTime + state.transitions,
                );
            } else {
                curGain.gain.setValueAtTime((overrideVolume ?? state.volume) * globalVolume, context.currentTime);
            }

            newSource.start(0, getSeek() ?? undefined);
            setAudioBufferSource(newSource);
            startedRef.current = true;
        },
        [audioBuffer, getSeek, state.transitions, globalVolume, state.volume],
    );
    startRef.current = start;

    useEffect(() => {
        return () => {
            console.log('onDismount effect ran');
            stopRef.current(/* now = */ true);
        };
    }, []);

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
            const audioBuffer = await new Promise<AudioBuffer>((resolve, reject) =>
                context.decodeAudioData(cached, resolve, (e) => reject(e)),
            );
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
                stopRef.current(/* now = */ true);
            }
            setTime(getSeek() ?? 0);
        }
    }, [loadingRef.current, state.pauseTime, getSeek]);

    useEffect(() => {
        if (!loadingRef.current && !transitioning) {
            console.log('Volume setter called');

            gainNode.gain.setValueAtTime((overrideVolume ?? state.volume) * globalVolume, context.currentTime);

            setVolume(overrideVolume ?? state.volume);
        }
    }, [state.volume, globalVolume, loadingRef.current, transitioning, overrideVolume, gainNode]);

    useEffect(() => {
        if (!loadingRef.current) {
            audioBufferSource.playbackRate.setValueAtTime(state.speed, context.currentTime);
        }
    }, [audioBufferSource, state.speed, loadingRef.current]);

    useEffect(() => {
        if (startedRef.current && (audioBufferSource.buffer?.duration ?? 0) > 0) {
            console.log('Setting onEnded');
            audioBufferSource.onended = () => {
                if (!loop) {
                    onFinish?.();
                }
            };
        }
    }, [audioBufferSource, onFinish, loop]);

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
