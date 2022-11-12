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
import * as API from '~/lib/api/models';
import { useUpdateTrackMutation } from '~/lib/api/hooks';

const FolderAddDialog: FC<{ files: API.Track[]; cancel: () => void }> = ({ files, cancel }) => {
    const workspaceId = useContext(WorkspaceIdContext);
    const [name, setName] = useState('');
    const { currentPath: currentPathLRV } = useContext(WorkspaceLRVContext);
    const [currentPath] = useLocalReactiveValue(currentPathLRV);

    const updateTrack = useUpdateTrackMutation(workspaceId);

    const onCancel = () => {
        setName('');
        cancel();
    };

    const addFilesToFolder = async () => {
        onCancel();

        // We can assign all files to a new folder by just adding the name on.
        // The captured value of "name" is unaffected by the call to onCancel above.
        const targetPath = [...currentPath, name];
        await Promise.all(files.map((f) => updateTrack.mutateAsync({ trackId: f.id, update: { path: targetPath } })));
    };

    const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.code !== 'Enter') return;

        e.preventDefault();
        addFilesToFolder();
    };

    return (
        <Dialog open={files.length > 0} onClose={onCancel}>
            <DialogTitle>Add Folder</DialogTitle>
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
                <Button onClick={addFilesToFolder}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FolderAddDialog;
