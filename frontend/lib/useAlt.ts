import { useEffect, useState } from 'react';

export default function useAlt(): boolean {
    const [altDown, setAlt] = useState(false);

    useEffect(() => {
        const fn = (ev: KeyboardEvent) => {
            setAlt(ev.altKey);
        };
        document.addEventListener('keydown', fn);
        document.addEventListener('keyup', fn);
        return () => {
            document.removeEventListener('keydown', fn);
            document.removeEventListener('keyup', fn);
        };
    }, []);

    return altDown;
}
