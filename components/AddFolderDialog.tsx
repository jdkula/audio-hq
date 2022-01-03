/**
 * AddFolderDialog.tsx
 * ========================
 * Provides a simple dialog that combines
 * multiple files together into a new folder.
 */

import React, { FC, useState, useContext, KeyboardEvent } from 'react';

import { File as WSFile } from '~/lib/Workspace';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { FileManagerContext } from '~/lib/useFileManager';

const FolderAddDialog: FC<{ files: WSFile[]; cancel: () => void }> = ({ files, cancel }) => {
    const [name, setName] = useState('');
    const fileManager = useContext(FileManagerContext);

    const onCancel = () => {
        setName('');
        cancel();
    };

    const addFilesToFolder = async () => {
        onCancel();

        // We can assign all files to a new folder by just adding the name on.
        // The captured value of "name" is unaffected by the call to onCancel above.
        await Promise.all(files.map((file) => fileManager.update(file.id, { path: [...file.path, name] })));
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
