/**
 * FileEntry/DeleteDialog.tsx
 * ===========================
 * Presents a dialog modal that confirms if the user
 * truly wants to delete the given file.
 */

import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@mui/material';
import React, { FC, useContext } from 'react';
import { useDeleteEntryMutation } from '~/lib/api/hooks';
import * as API from 'common/lib/api/models';
import { WorkspaceIdContext } from '~/lib/utility/context';

const FileDeleteDialog: FC<DialogProps & { file: API.Entry }> = ({ file, ...props }) => {
    const workspaceId = useContext(WorkspaceIdContext);
    const deleteFile = useDeleteEntryMutation(workspaceId);

    const doDelete = () => {
        deleteFile.mutate({ entry: file });
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
