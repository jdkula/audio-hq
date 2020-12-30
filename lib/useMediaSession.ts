import { useRef, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { globalVolumeAtom } from './atoms';
import { Workspace, WorkspaceResolver } from './Workspace';

const useMediaSession = (workspace: Workspace | null, resolver: WorkspaceResolver): void => {
    const [globalVolume, setGlobalVolume] = useRecoilState(globalVolumeAtom);
    const previousVolumeValue = useRef<number | null>(null);

    const currentlyPlaying = workspace?.files.find(
        (file) =>
            file.id === (workspace.state.playing?.id ?? workspace.state.ambience[0]?.id ?? workspace.state.sfx.sfx?.id),
    );
};

export default useMediaSession;
