import { useCallback, useEffect, useRef, useState } from 'react';

const useAudioContext = (): { context: AudioContext; blocked: boolean } => {
    if (typeof window === 'undefined') {
        return null as never; // SSR
    }

    const [context, setContext] = useState<AudioContext>(new (AudioContext || (window as any).webkitAudioContext)());

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
        if (context.state !== 'running') {
            setIsBlocked(true);
            setInteractGate();
        }
    }, []);

    return { context, blocked: isBlocked };
};

export default useAudioContext;
