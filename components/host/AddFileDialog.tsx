import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    FormControlLabel,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from '@material-ui/core';
import React, { FC, useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileManagerContext } from '~/lib/useFileManager';
import styled from 'styled-components';
import { ExpandMore } from '@material-ui/icons';

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
    const [description, setDescription] = useState('');

    const [shouldCut, setShouldCut] = useState(true);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(3600);

    const fileManager = useContext(FileManagerContext);

    const doClose = () => {
        setUrl('');
        setName('');
        setFile(null);
        setShouldCut(true);
        setStartTime(0);
        setEndTime(3600);
        props.onClose?.({}, 'escapeKeyDown');
    };

    const onUpload = () => {
        const options = {
            cut: shouldCut ? { start: startTime, end: endTime } : undefined,
        };
        if (file) {
            fileManager.upload(name || file.name, file, currentPath, description, options);
            doClose();
        } else if (name) {
            fileManager.import(name, url, currentPath, description, options);
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
        fileInfo = <Typography variant="body1">Drag files or click here to upload them!</Typography>;
    }

    const notifyEnterName = !!(!name && url);

    return (
        <Dialog {...props} onClose={doClose}>
            <DialogTitle>Add a track!</DialogTitle>
            <DialogContent dividers style={{ minWidth: '300px' }}>
                <TextField
                    id="track-title"
                    value={name}
                    fullWidth
                    autoFocus
                    required
                    variant="outlined"
                    onChange={(e) => setName(e.target.value)}
                    label="Track Title"
                    placeholder={file ? file.name : undefined}
                    error={notifyEnterName}
                    InputLabelProps={
                        file
                            ? {
                                  shrink: true,
                              }
                            : undefined
                    }
                    helperText={notifyEnterName ? 'Please enter a track title!' : undefined}
                />
                <Box m="0.5rem" />
                <TextField
                    id="track-description"
                    value={description}
                    fullWidth
                    size="small"
                    variant="outlined"
                    onChange={(e) => setDescription(e.target.value)}
                    label="Track Description"
                />
                <Box m="1rem" />

                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        id="uploadimport-header"
                        aria-controls="uploadimport-content"
                    >
                        Upload {'&'} Import *
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box m="0.5rem" width="100%">
                            {!url && (
                                <DropRoot {...getRootProps()} isDragActive={isDragActive}>
                                    <input {...getInputProps()} />
                                    {fileInfo}
                                </DropRoot>
                            )}

                            {!url && !file && (
                                <Box textAlign="center" style={{ margin: '1rem' }}>
                                    - or, import from a website (youtube, etc.) -
                                </Box>
                            )}
                            {!file && (
                                <TextField
                                    value={url}
                                    id="track-url"
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => setUrl(e.target.value)}
                                    label="URL"
                                />
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        id="otheroptions-header"
                        aria-controls="otheroptions-content"
                    >
                        Other Options
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box clone width="100%">
                            <Accordion defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    id="cut-header"
                                    aria-controls="cut-content"
                                >
                                    <Box display="flex" alignItems="center">
                                        <Checkbox
                                            aria-label="Time Cut Checkbox"
                                            onClick={(event) => event.stopPropagation()}
                                            onFocus={(event) => event.stopPropagation()}
                                            onChange={(e) => setShouldCut(e.currentTarget.checked)}
                                            checked={shouldCut}
                                        />
                                        <Typography>Time Cut</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box display="flex" alignItems="center" flexDirection="column" textAlign="center">
                                        <Box mb="1rem">
                                            <Typography>
                                                Audio HQ, by default, cuts tracks to be at most 1 hour long. You can
                                                change or disable that here.
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                                            <TextField
                                                type="number"
                                                variant="outlined"
                                                label="Start Time"
                                                size="small"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">seconds</InputAdornment>
                                                    ),
                                                }}
                                                inputProps={{
                                                    style: { maxWidth: '5rem' },
                                                }}
                                                value={startTime}
                                                onChange={(e) => setStartTime(parseInt(e.currentTarget.value))}
                                            />
                                            <Box m="0.5rem">
                                                <Typography>to</Typography>
                                            </Box>
                                            <TextField
                                                type="number"
                                                variant="outlined"
                                                label="End Time"
                                                size="small"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">seconds</InputAdornment>
                                                    ),
                                                }}
                                                inputProps={{
                                                    style: { maxWidth: '5rem' },
                                                }}
                                                value={endTime}
                                                onChange={(e) => setEndTime(parseInt(e.currentTarget.value))}
                                            />
                                        </Box>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </AccordionDetails>
                </Accordion>
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
