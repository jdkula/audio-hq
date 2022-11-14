/**
 * FolderEntry/FolderDeleteDialog.tsx
 * ==============================
 * Provides a dialog modal that confirms if the user
 * truly wants to delete this folder.
 */

import React, { FC } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@mui/material';

const FolderDeleteDialog: FC<DialogProps & { folder: string; onConfirm: () => void }> = ({
    folder,
    onConfirm,
    ...props
}) => {
    const doDelete = () => {
        onConfirm();
        props.onClose?.({}, 'escapeKeyDown');
    };

    return (
        <Dialog {...props}>
            <DialogTitle>Really delete {folder}?</DialogTitle>
            <DialogContent dividers>
                This will hide all the files and folders inside. You can regain access to them by searching or
                recreating a folder with the same name.
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose?.({}, 'escapeKeyDown')}>Cancel</Button>
                <Button color="secondary" onClick={doDelete}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FolderDeleteDialog;
