import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    TextField,
    Typography,
} from '@material-ui/core';
import React, { FC, useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileManagerContext } from '~/lib/useFileManager';
import styled from 'styled-components';

const DropRoot = styled.div<{ isDragActive?: boolean }>`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: ${({ isDragActive }) => (isDragActive ? '#2196f3' : '#eeeeee')};
    border-style: dashed;
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    transition: border 0.24s ease-in-out;

    &:hover {
        border-color: #cccccc;
    }
`;

const AddFileDialog: FC<DialogProps & { currentPath?: string[] }> = ({ currentPath, ...props }) => {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const fileManager = useContext(FileManagerContext);

    const doClose = () => {
        setUrl('');
        setName('');
        setFile(null);
        props.onClose?.({}, 'escapeKeyDown');
    };

    const onUpload = () => {
        if (file) {
            fileManager.upload(name || file.name, file, currentPath);
            doClose();
        } else if (name) {
            fileManager.import(name, url, currentPath);
            doClose();
        }
    };

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        setFile(acceptedFiles[0]);
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    let fileInfo;
    if (file) {
        fileInfo = (
            <Typography variant="body1" color="textPrimary">
                {file.name}
            </Typography>
        );
    } else {
        fileInfo = <Typography variant="body1">Drag files or click here to upload!</Typography>;
    }

    const notifyEnterName = !!(!name && url);

    return (
        <Dialog {...props} onClose={doClose}>
            <DialogTitle>Add a track!</DialogTitle>
            <DialogContent dividers style={{ minWidth: '300px' }}>
                <TextField
                    value={name}
                    fullWidth
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                    label="Name"
                    placeholder={file ? file.name : undefined}
                    error={notifyEnterName}
                    InputLabelProps={
                        file
                            ? {
                                  shrink: true,
                              }
                            : undefined
                    }
                    helperText={notifyEnterName ? 'Please enter a file name!' : undefined}
                />

                <Box m="1rem" />

                {!url && (
                    <DropRoot {...getRootProps()} isDragActive={isDragActive}>
                        <input {...getInputProps()} />
                        {fileInfo}
                    </DropRoot>
                )}

                {!url && !file && (
                    <Box textAlign="center" style={{ marginTop: '1rem' }}>
                        - or -
                    </Box>
                )}
                {!file && <TextField value={url} fullWidth onChange={(e) => setUrl(e.target.value)} label="URL" />}
            </DialogContent>
            <DialogActions>
                {file && <Button onClick={() => setFile(null)}>Clear</Button>}
                <Button color={file || (url && name) ? 'primary' : undefined} onClick={onUpload}>
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFileDialog;
