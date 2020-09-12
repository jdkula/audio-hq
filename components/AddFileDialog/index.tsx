import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle } from '@material-ui/core';
import React, { ClipboardEvent, FC, KeyboardEvent, useContext, useRef, useState } from 'react';
import { FileManagerContext } from '~/lib/useFileManager';
import styled from 'styled-components';
import ConvertOptions from '~/lib/ConvertOptions';
import TrackOptions, { TrackRef } from './TrackOptions';
import TrackImportDetails from './TrackImportDetails';
import TrackDetails from './TrackDetails';

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
    const optionsRef = useRef<TrackRef | null>(null);

    const titleRef = useRef<HTMLInputElement | null>(null);

    const fileManager = useContext(FileManagerContext);

    const doClose = (shouldClose = true) => {
        setUrl('');
        setTitle('');
        setDescription('');
        setOptions({});
        optionsRef.current?.reset();
        if (shouldClose) {
            props.onClose?.({}, 'escapeKeyDown');
        } else {
            console.log(titleRef);
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
            doClose(shouldClose);
        } else if (title) {
            fileManager.import(title, url, currentPath, description, options);
            doClose(shouldClose);
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
        <Dialog {...props} onClose={() => doClose()} onPasteCapture={handleUrlPaste} onKeyDown={handleEnter}>
            <DialogTitle>Add a track!</DialogTitle>
            <AddTrackContent dividers>
                <TrackDetails
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    file={file}
                    titleRef={titleRef}
                    error={notifyEnterName}
                />

                <div>
                    <TrackImportDetails {...{ url, setUrl, file, setFile }} />
                    <TrackOptions ref={optionsRef} setOptions={setOptions} />
                </div>
            </AddTrackContent>
            <DialogActions>
                {file && <Button onClick={() => setFile(null)}>Clear</Button>}
                <Button color={ready ? 'primary' : undefined} onClick={() => (ready ? onUpload() : doClose())}>
                    {ready ? (file ? 'Upload' : 'Import') : 'Close'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFileDialog;
