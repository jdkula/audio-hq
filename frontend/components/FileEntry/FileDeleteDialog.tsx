/**
 * FileEntry/DeleteDialog.tsx
 * ===========================
 * Presents a dialog modal that confirms if the user
 * truly wants to delete the given file.
 */

import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@mui/material';
import React, { FC } from 'react';
import { File_Minimum } from '../../lib/urql/graphql_type_helper';
import { useDeleteFileMutation } from '../../lib/generated/graphql';

const FileDeleteDialog: FC<DialogProps & { file: File_Minimum }> = ({ file, ...props }) => {
    const [, deleteFile] = useDeleteFileMutation();

    const doDelete = () => {
        deleteFile({ job: { file_id: file.id } });
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

export default FileDeleteDialog;
