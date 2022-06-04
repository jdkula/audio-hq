/**
 * AddFileDialog/index.tsx
 * ========================
 * Provides a dialog modal allowing users to add songs to their workspace.
 * Provides options to add a title, description, import from URL or upload a file,
 * as well as track editing options like cuts and fades.
 *
 * Pasting anywhere with a URL fills in the URL field.
 * Enter anywhere submits the form and closes the modal.
 * Shift+Enter anywhere submits the form, resets it, and focuses the title input.
 */

import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@mui/material';
import React, { ClipboardEvent, FC, KeyboardEvent, useContext, useRef, useState } from 'react';
import styled from '@emotion/styled';
import ConvertOptions from '~/lib/ConvertOptions';
import TrackOptions, { TrackRef } from './TrackOptions';
import TrackImportDetails from './TrackImportDetails';
import TrackDetails from './TrackDetails';
import { FileManagerContext } from '~/lib/utility/context';

/** Dialog content wrapper */
const AddTrackContent = styled(DialogContent)`
    min-width: 300px;
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: 1rem;
`;

const AddFileDialog: FC<DialogProps & { currentPath?: string[] }> = ({ currentPath, ...props }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [url, setUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const [options, setOptions] = useState<ConvertOptions>({});

    // TrackRef provides a reset function to clear/reset its fields.
    const optionsRef = useRef<TrackRef | null>(null);

    // Needed to focus the title on shift+enter.
    const titleRef = useRef<HTMLInputElement | null>(null);

    const fileManager = useContext(FileManagerContext);

    const afterSubmit = (shouldClose = true) => {
        setUrl('');
        setTitle('');
        setFile(null);
        setDescription('');
        setOptions({});
        optionsRef.current?.reset();
        if (shouldClose) {
            props.onClose?.({}, 'escapeKeyDown');
        } else {
            titleRef.current?.focus();
        }
    };

    const isUrl = (text: string) => {
        let url;
        try {
            url = new URL(text);
        } catch (_) {
            return false;
        }

        return url.protocol.startsWith('http');
    };

    const handleUrlPaste = (e: ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData('text/plain');
        if (isUrl(pasted) && !url && !file) {
            setUrl(pasted);
            e.preventDefault();
        }
    };

    const onUpload = (shouldClose = true) => {
        if (file) {
            fileManager.upload(title || file.name, file, currentPath, description, options);
            afterSubmit(shouldClose);
        } else if (title) {
            fileManager.import(title, url, currentPath, description, options);
            afterSubmit(shouldClose);
        }
    };

    const notifyEnterName = !!(!title && url);

    const ready = file || (url && title);

    const handleEnter = (e: KeyboardEvent<never>) => {
        if (!ready) return;
        if (e.key !== 'Enter') return;
        e.preventDefault();
        onUpload(!e.shiftKey);
    };

    return (
        <Dialog {...props} onClose={() => afterSubmit()} onPasteCapture={handleUrlPaste} onKeyDown={handleEnter}>
            <DialogTitle>Add a track!</DialogTitle>
            <AddTrackContent dividers>
                <TrackDetails
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    file={file}
                    titleRef={titleRef}
                    incomplete={notifyEnterName}
                />

                <div>
                    <TrackImportDetails {...{ url, setUrl, file, setFile }} />
                    <TrackOptions ref={optionsRef} setOptions={setOptions} />
                </div>
            </AddTrackContent>
            <DialogActions>
                {file && <Button onClick={() => setFile(null)}>Clear</Button>}
                <Button color={ready ? 'primary' : undefined} onClick={() => (ready ? onUpload() : afterSubmit())}>
                    {ready ? (file ? 'Upload' : 'Import') : 'Close'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFileDialog;
