/**
 * AddFolderDialog.tsx
 * ========================
 * Provides a simple dialog that combines
 * multiple files together into a new folder.
 */

import React, { FC, KeyboardEvent, useContext, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useLocalReactiveValue } from '../lib/LocalReactive';
import { FileManagerContext, WorkspaceIdContext, WorkspaceLRVContext } from '~/lib/utility/context';
import * as API from '~/lib/api/models';
import { useCreateFolderMutation, useUpdateEntryMutation } from '~/lib/api/hooks';

const FolderAddDialog: FC<{ showing?: boolean; cancel: () => void }> = ({ showing, cancel }) => {
    const workspaceId = useContext(WorkspaceIdContext);
    const [name, setName] = useState('');
    const { currentPath: currentPathLRV } = useContext(WorkspaceLRVContext);
    const [currentPath] = useLocalReactiveValue(currentPathLRV);
    const fileManager = useContext(FileManagerContext);

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
        if (e.nativeEvent.code !== 'Enter') return;

        e.preventDefault();
        createFolder();
    };

    return (
        <Dialog open={!!showing} onClose={onCancel}>
            <DialogTitle>Create Folder</DialogTitle>
            <DialogContent dividers>
                <TextField
                    id="folder-name"
                    value={name}
                    variant="outlined"
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleEnter}
                    label="Folder Name"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={createFolder}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FolderAddDialog;
