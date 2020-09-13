import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@material-ui/core';
import React, { FC, useContext } from 'react';
import { FileManagerContext } from '~/lib/useFileManager';
import { File as WSFile } from '~/lib/Workspace';

const DeleteDialog: FC<DialogProps & { file: WSFile }> = ({ file, ...props }) => {
    const fileManager = useContext(FileManagerContext);

    const doDelete = () => {
        fileManager.delete(file.id);
        props.onClose?.({}, 'escapeKeyDown');
    };

    return (
        <Dialog {...props}>
            <DialogTitle>Really delete {file.name}?</DialogTitle>
            <DialogContent dividers>This is irreversable.</DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose?.({}, 'escapeKeyDown')}>Cancel</Button>
                <Button color="secondary" onClick={doDelete}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
