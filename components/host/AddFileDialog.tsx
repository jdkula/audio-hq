import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, TextField } from '@material-ui/core';
import React, { FC, useState, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileManagerContext } from '~/lib/useFileManager';

const AddFileDialog: FC<DialogProps> = (props) => {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');

    const fileManager = useContext(FileManagerContext);

    const doClose = () => {
        setUrl('');
        setName('');
        props.onClose?.({}, 'escapeKeyDown');
    };

    const onUpload = () => {
        fileManager.import(name, url);
        doClose();
    };

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        fileManager.upload(name, acceptedFiles[0]);
        doClose();
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <Dialog {...props}>
            <DialogTitle>Add a track!</DialogTitle>
            <DialogContent>
                <TextField value={name} onChange={(e) => setName(e.target.value)} label="Name" />

                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the files here ...</p>
                    ) : (
                        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
                    )}
                </div>

                <div> - or - </div>

                <TextField value={url} onChange={(e) => setUrl(e.target.value)} label="URL" />
            </DialogContent>
            <DialogActions>
                <Button onClick={onUpload}>Upload</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFileDialog;
