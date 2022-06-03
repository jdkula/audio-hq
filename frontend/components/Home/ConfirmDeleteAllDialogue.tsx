import {
    DialogProps,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    DialogActions,
    Button,
    CircularProgress,
} from '@mui/material';
import { FC, useState, useEffect } from 'react';
import PouchDB from 'pouchdb';

// thanks https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string/10420404 !
export function humanFileSize(bytes: number, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

    return bytes.toFixed(dp) + ' ' + units[u];
}

export const ConfirmDeleteAllDialog: FC<DialogProps> = (props) => {
    const [deleting, setDeleting] = useState(false);

    const [size, setSize] = useState<number | null>(null);

    useEffect(() => {
        if (props.open) {
            new PouchDB('cache')
                .allDocs({ attachments: true, binary: true, include_docs: true })
                .then((docs) => docs.rows.flatMap((doc) => Object.values(doc.doc?._attachments ?? {})))
                .then((attachments) =>
                    attachments.map((attachment) => ((attachment as PouchDB.Core.FullAttachment).data as Blob).size),
                )
                .then((sizes) => sizes.reduce((sum, cur) => sum + cur, 0))
                .then((totalSize) => setSize(totalSize));
        }
    }, [props.open]);

    const doDelete = () => {
        setDeleting(true);
        new PouchDB('cache').destroy().then(() => window.location.reload());
    };

    return (
        <Dialog {...props}>
            <DialogTitle>Clear Audio Cache</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1">
                    Are you sure? This will completely clear all stored music, meaning you&apos;ll have to download
                    everything from scratch!
                </Typography>
                <Box m="1rem" />
                <Typography variant="button">
                    Total Size: {size === null ? 'Calculating...' : humanFileSize(size, true)}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.onClose?.({}, 'escapeKeyDown')}>Cancel</Button>
                {deleting ? (
                    <CircularProgress />
                ) : (
                    <Button onClick={doDelete} color="secondary">
                        Delete
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
