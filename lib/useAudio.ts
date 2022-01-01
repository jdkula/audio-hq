import { PlayState } from './Workspace';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { FileManagerContext } from './useFileManager';
import { useRecoilValue } from 'recoil';
import { globalVolumeAtom } from './atoms';
import { WorkspaceContext } from './useWorkspace';

interface AudioInfo {
    duration: number;
    volume: number;
    time: number;
    paused: boolean;
    loading: boolean;
    blocked: boolean;
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
    const ws = useContext(WorkspaceContext);
    const [seek, setSeek] = useState(0);

    const [n, setN] = useState(0);

    useEffect(() => {
        const handle = window.setInterval(() => setN((n) => n + 1), 1000);
        return () => window.clearInterval(handle);
    }, []);

    if (!state) {
        return {
            duration: 2,
            paused: false,
            time: 1,
            volume: 0.5,
            loading: false,
            blocked: false,
        };
    }

    const f = ws.getCurrentTrackFrom(state)?.file;

    useEffect(() => {
        if (!f || !state.startTimestamp) {
            return;
        }
        const timeElapsedMs = ((state.pauseTime ?? Date.now()) - state.startTimestamp) * state.speed;
        let seek = 0;
        if (timeElapsedMs > f.length * 1000 && !loop) {
            seek = f.length;
        }
        seek = (timeElapsedMs % (f.length * 1000)) / 1000;

        setSeek(seek);
    }, [state, n]);

    return {
        duration: f?.length ?? 2,
        paused: state.pauseTime !== null,
        time: seek,
        volume: state.volume,
        loading: false,
        blocked: false,
    };
};

export default useAudio;
