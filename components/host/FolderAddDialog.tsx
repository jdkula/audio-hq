import Axios from 'axios';
import React, { FC, useState, useContext, KeyboardEvent } from 'react';
import { mutate } from 'swr';
import { WorkspaceContext } from '~/pages/[id]/host';

import { File as WSFile } from '~/lib/Workspace';
import { Dialog, DialogTitle, Typography, DialogContent, TextField, DialogActions, Button } from '@material-ui/core';
import { FileManagerContext } from '~/lib/useFileManager';

const FolderAddDialog: FC<{ files: WSFile[]; cancel: () => void }> = ({ files, cancel }) => {
    const [name, setName] = useState('');
    const workspace = useContext(WorkspaceContext);
    const fileManager = useContext(FileManagerContext);

    const doCancel = () => {
        setName('');
        cancel();
    };

    const addFilesToFolder = async () => {
        doCancel();
        await Promise.all(files.map((file) => fileManager.update(file.id, { path: [...file.path, name] })));
    };

    const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.code === 'Enter') {
            e.preventDefault();
            addFilesToFolder();
        }
    };

    return (
        <Dialog open={files.length > 0} onClose={doCancel}>
            <DialogTitle>Add Folder</DialogTitle>
            <DialogContent dividers>
                <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleEnter}
                    label="Folder Name"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={doCancel}>Cancel</Button>
                <Button onClick={addFilesToFolder}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FolderAddDialog;
