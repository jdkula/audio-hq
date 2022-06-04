/**
 * context.tsx
 * =============
 * Provides React contexts and providers
 */
import { createContext, ReactNode, useMemo } from 'react';
import { kCurrentPathKeyPrefix, kFavoritesKeyPrefix, kLastSFXPlayedKeyPrefix } from '~/lib/constants';
import { LocalReactiveValue, LocalStorageReactiveValue } from '~/lib/LocalReactive';
import { FileManager, useFileManager } from '~/lib/useWorkspaceDetails';

// <== Access to the workspace ID and name ==>
export const WorkspaceIdContext = createContext<string>(null as never);
export const WorkspaceNameContext = createContext<string>(null as never);

// <== Access to the file manager ==>
export const FileManagerContext = createContext<FileManager>(null as never);

export function FileManagerProvider(props: { children?: React.ReactNode; workspaceId: string }) {
    const fileManager = useFileManager(props.workspaceId);

    return <FileManagerContext.Provider value={fileManager}>{props.children}</FileManagerContext.Provider>;
}

// <== Workspace-bound Local Reactive Values ==>
export interface WorkspaceLRVContextType {
    favorites: LocalReactiveValue<string[]>;
    currentPath: LocalReactiveValue<string[]>;
    lastSfxPlayed: LocalReactiveValue<number>;
}
export const WorkspaceLRVContext = createContext<WorkspaceLRVContextType>(null as never);

export function WorkspaceLocalReactiveValuesProvider(props: { workspaceId: string; children?: ReactNode }) {
    const lrvs: WorkspaceLRVContextType = useMemo(
        () => ({
            currentPath: new LocalStorageReactiveValue(kCurrentPathKeyPrefix + props.workspaceId, []),
            favorites: new LocalStorageReactiveValue(kFavoritesKeyPrefix + props.workspaceId, []),
            lastSfxPlayed: new LocalStorageReactiveValue(kLastSFXPlayedKeyPrefix + props.workspaceId, 0),
        }),
        [props.workspaceId],
    );

    return <WorkspaceLRVContext.Provider value={lrvs}>{props.children}</WorkspaceLRVContext.Provider>;
}
