/**
 * FileEntry/DeleteDialog.tsx
 * ===========================
 * Presents a dialog modal that confirms if the user
 * truly wants to delete the given file.
 */

import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@mui/material';
import React, { FC, useContext } from 'react';
import { useDeleteTrackMutation } from '~/lib/api/hooks';
import * as API from '~/lib/api/models';
import { WorkspaceIdContext } from '~/lib/utility/context';

const FileDeleteDialog: FC<DialogProps & { file: API.Track }> = ({ file, ...props }) => {
    const workspaceId = useContext(WorkspaceIdContext);
    const deleteFile = useDeleteTrackMutation(workspaceId);

    const doDelete = () => {
        deleteFile.mutate({ id: file.id });
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
