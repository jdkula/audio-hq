import { useEffect, useState } from 'react';

const kLocalRecentKey = '__AHQ_RECENT_WORKSPACES';
const kMaxRecents = 5;

type LocalRecents = [recents: string[], addRecent: (workspace: string) => void];

export default function useLocalRecents(): LocalRecents {
    const [recents, setRecents] = useState<string[]>([]);

    useEffect(() => {
        setRecents(JSON.parse(localStorage.getItem(kLocalRecentKey) ?? '[]'));
    }, []);

    useEffect(() => {
        localStorage.setItem(kLocalRecentKey, JSON.stringify(recents));
    }, [recents]);

    return [
        recents,
        (workspace: string) =>
            setRecents((recents) => {
                const existingIdx = recents.indexOf(workspace);
                if (existingIdx !== -1) {
                    recents.splice(existingIdx, 1);
                }

                return [workspace, ...recents].slice(0, kMaxRecents);
            }),
    ];
}
