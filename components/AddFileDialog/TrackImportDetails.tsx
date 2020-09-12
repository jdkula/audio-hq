import { Accordion, AccordionSummary, AccordionDetails, Box, TextField, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

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

interface TrackImportDetailsProps {
    url: string;
    setUrl: (url: string) => void;

    file: File | null;
    setFile: (file: File | null) => void;
}

const TrackImportDetails: FC<TrackImportDetailsProps> = ({ url, setUrl, file, setFile }) => {
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

    return (
        <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />} id="uploadimport-header" aria-controls="uploadimport-content">
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
    );
};

export default TrackImportDetails;
