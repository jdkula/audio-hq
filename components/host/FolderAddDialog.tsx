import Axios from 'axios';
import React, { FC, useState, useContext } from 'react';
import { mutate } from 'swr';
import { WorkspaceContext } from '~/pages/[id]/host';

import { File as WSFile } from '~/lib/Workspace';
import { Dialog, DialogTitle, Typography, DialogContent, TextField, DialogActions, Button } from '@material-ui/core';

const FolderAddDialog: FC<{ files: WSFile[]; cancel: () => void }> = ({ files, cancel }) => {
    const [name, setName] = useState('');
    const workspace = useContext(WorkspaceContext);

    const doCancel = () => {
        setName('');
        cancel();
    };

    const addFilesToFolder = async () => {
        doCancel();
        await Promise.all(
            files.map(async (file) => Axios.put(`/api/files/${file.id}`, { path: [...file.path, name] })),
        );
        if (workspace) mutate(`/api/${workspace.name}/files`);
    };

    return (
        <Dialog open={files.length > 0} onClose={doCancel}>
            <DialogTitle>Add Folder</DialogTitle>
            <DialogContent dividers>
                <TextField value={name} onChange={(e) => setName(e.target.value)} label="Folder Name" />
            </DialogContent>
            <DialogActions>
                <Button onClick={doCancel}>Cancel</Button>
                <Button onClick={addFilesToFolder}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FolderAddDialog;
