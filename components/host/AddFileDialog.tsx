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
    Hidden,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from '@material-ui/core';
import React, { ClipboardEvent, FC, KeyboardEvent, useContext, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileManagerContext } from '~/lib/useFileManager';
import styled from 'styled-components';
import { ExpandMore } from '@material-ui/icons';

const DropRoot = styled.div<{ isDragActive?: boolean }>`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
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

    const [shouldFadeIn, setShouldFadeIn] = useState(false);
    const [shouldFadeOut, setShouldFadeOut] = useState(false);
    const [fadeInTime, setFadeInTime] = useState(3);
    const [fadeOutTime, setFadeOutTime] = useState(3);

    const titleRef = useRef<HTMLInputElement | null>(null);

    const fileManager = useContext(FileManagerContext);

    const doClose = (shouldClose = true) => {
        setUrl('');
        setName('');
        setDescription('');
        setFile(null);
        setShouldCut(true);
        setStartTime(0);
        setEndTime(3600);
        setShouldFadeIn(false);
        setShouldFadeOut(false);
        setFadeInTime(3);
        setFadeOutTime(3);
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
        const options = {
            cut: shouldCut ? { start: startTime, end: endTime } : undefined,
            fadeIn: shouldFadeIn ? fadeInTime : undefined,
            fadeOut: shouldFadeOut ? fadeOutTime : undefined,
        };
        if (file) {
            fileManager.upload(name || file.name, file, currentPath, description, options);
            doClose(shouldClose);
        } else if (name) {
            fileManager.import(name, url, currentPath, description, options);
            doClose(shouldClose);
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

    const ready = file || (url && name);

    const handleEnter = (e: KeyboardEvent<never>) => {
        if (!ready) return;
        if (e.key !== 'Enter') return;
        e.preventDefault();
        onUpload(!e.shiftKey);
    };

    const timeOptionsInner = (
        <>
            <TextField
                onKeyDown={handleEnter}
                type="number"
                variant="outlined"
                label="Start Time"
                size="small"
                InputProps={{
                    endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
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
                onKeyDown={handleEnter}
                type="number"
                variant="outlined"
                label="End Time"
                size="small"
                InputProps={{
                    endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                }}
                inputProps={{
                    style: { maxWidth: '5rem' },
                }}
                value={endTime}
                onChange={(e) => setEndTime(parseInt(e.currentTarget.value))}
            />
        </>
    );

    return (
        <Dialog {...props} onClose={() => doClose()} onPasteCapture={handleUrlPaste}>
            <DialogTitle>Add a track!</DialogTitle>
            <DialogContent dividers style={{ minWidth: '300px' }}>
                <TextField
                    id="track-title"
                    value={name}
                    inputRef={titleRef}
                    fullWidth
                    autoFocus
                    required
                    variant="outlined"
                    onKeyDown={handleEnter}
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
                    onKeyDown={handleEnter}
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
                                    onKeyDown={handleEnter}
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
                        <Box width="100%" display="flex" flexDirection="column">
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
                                        <Hidden xsDown>
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                width="100%"
                                            >
                                                {timeOptionsInner}
                                            </Box>
                                        </Hidden>
                                        <Hidden smUp>
                                            <Box
                                                display="flex"
                                                flexDirection="column"
                                                alignItems="center"
                                                justifyContent="center"
                                                width="100%"
                                            >
                                                {timeOptionsInner}
                                            </Box>
                                        </Hidden>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    id="fadein-header"
                                    aria-controls="fadein-content"
                                >
                                    <Box display="flex" alignItems="center">
                                        <Checkbox
                                            aria-label="Fade In Checkbox"
                                            onClick={(event) => event.stopPropagation()}
                                            onFocus={(event) => event.stopPropagation()}
                                            onChange={(e) => setShouldFadeIn(e.currentTarget.checked)}
                                            checked={shouldFadeIn}
                                        />
                                        <Typography>Fade In</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box display="flex" alignItems="center" flexDirection="column" textAlign="center">
                                        <Box mb="1rem">
                                            <Typography>
                                                Allow the audio track to fade in for the specified number of seconds at
                                                its beginning.
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                                            <TextField
                                                onKeyDown={handleEnter}
                                                type="number"
                                                variant="outlined"
                                                label="Fade Time"
                                                size="small"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">seconds</InputAdornment>
                                                    ),
                                                }}
                                                inputProps={{
                                                    style: { maxWidth: '5rem' },
                                                }}
                                                value={fadeInTime}
                                                onChange={(e) => setFadeInTime(parseInt(e.currentTarget.value))}
                                            />
                                        </Box>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    id="fadein-header"
                                    aria-controls="fadein-content"
                                >
                                    <Box display="flex" alignItems="center">
                                        <Checkbox
                                            aria-label="Fade Out Checkbox"
                                            onClick={(event) => event.stopPropagation()}
                                            onFocus={(event) => event.stopPropagation()}
                                            onChange={(e) => setShouldFadeOut(e.currentTarget.checked)}
                                            checked={shouldFadeOut}
                                        />
                                        <Typography>Fade Out</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box display="flex" alignItems="center" flexDirection="column" textAlign="center">
                                        <Box mb="1rem">
                                            <Typography>
                                                Allow the audio track to fade out for the specified number of seconds at
                                                its end.
                                            </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                                            <TextField
                                                onKeyDown={handleEnter}
                                                type="number"
                                                variant="outlined"
                                                label="Fade Time"
                                                size="small"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">seconds</InputAdornment>
                                                    ),
                                                }}
                                                inputProps={{
                                                    style: { maxWidth: '5rem' },
                                                }}
                                                value={fadeOutTime}
                                                onChange={(e) => setFadeOutTime(parseInt(e.currentTarget.value))}
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
                <Button color={ready ? 'primary' : undefined} onClick={ready ? onUpload : doClose}>
                    {ready ? (file ? 'Upload' : 'Import') : 'Close'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddFileDialog;
