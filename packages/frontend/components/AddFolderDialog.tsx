/**
 * AddFolderDialog.tsx
 * ========================
 * Provides a simple dialog that combines
 * multiple files together into a new folder.
 */

import React, { FC, KeyboardEvent, useContext, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useLocalReactiveValue } from '../lib/LocalReactive';
import { WorkspaceIdContext, WorkspaceLRVContext } from '~/lib/utility/context';
import { useCreateFolderMutation, useWorkspaceEntries } from '~/lib/api/hooks';
import { entryIsFolder } from '@audio-hq/clients/lib/AudioHQApi';
import _ from 'lodash';

const FolderAddDialog: FC<{ showing?: boolean; cancel: () => void }> = ({ showing, cancel }) => {
    const workspaceId = useContext(WorkspaceIdContext);
    const [name, setName] = useState('');
    const { currentPath: currentPathLRV } = useContext(WorkspaceLRVContext);
    const [currentPath] = useLocalReactiveValue(currentPathLRV);

    const overlappingFolders = useWorkspaceEntries(workspaceId)
        .data?.filter(entryIsFolder)
        .filter((entry) => _.isEqual(entry.path, currentPath))
        .map((entry) => entry.name);

    const nameCollision = overlappingFolders?.includes(name);

    const createFolderMutation = useCreateFolderMutation(workspaceId);

    const onCancel = () => {
        setName('');
        cancel();
    };

    const createFolder = async () => {
        onCancel();

        createFolderMutation.mutate({ name, basePath: currentPath });
    };

    const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.code !== 'Enter' || nameCollision) return;

        e.preventDefault();
        createFolder();
    };

    return (
        <Dialog open={!!showing} onClose={onCancel} fullWidth maxWidth="xs">
            <DialogTitle>Create Folder</DialogTitle>
            <DialogContent dividers>
                <TextField
                    id="folder-name"
                    value={name}
                    variant="outlined"
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleEnter}
                    label="Folder Name"
                    helperText={nameCollision ? 'That folder already exists; pick a new name' : ''}
                    error={nameCollision}
                    autoComplete="off"
                    fullWidth
                    autoFocus
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={createFolder} disabled={nameCollision}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FolderAddDialog;
