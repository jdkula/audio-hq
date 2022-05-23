/**
 * AddFileDialog/TrackImportDetails.tsx
 * ========================
 * Provides fields to accept a URL to import or file to upload.
 */

import { Accordion, AccordionSummary, AccordionDetails, TextField, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import React, { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from '@emotion/styled';

/** Container to drag a file on top of. */
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

    background-color: ${({ theme }) => (theme.palette.mode === 'dark' ? '#101010' : '#fafafa')};
    color: #bdbdbd;
    outline: none;
    transition: border 0.24s ease-in-out;

    &:hover {
        border-color: #cccccc;
    }
`;

const Spaced = styled.div`
    margin: 1rem;
`;

/** Container for the inside of the accordion. */
const TrackImportContainer = styled.div`
    width: 100%;
    margin: 0.5rem;
    display: flex;
    align-items: stretch;
    flex-direction: column;
    text-align: center;
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

    // If a file is available, show its name.
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
                <TrackImportContainer>
                    {!url && (
                        <DropRoot {...getRootProps()} isDragActive={isDragActive}>
                            <input {...getInputProps()} />
                            {fileInfo}
                        </DropRoot>
                    )}

                    {!url && !file && <Spaced> - or, import from a website (youtube, etc.) - </Spaced>}
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
                </TrackImportContainer>
            </AccordionDetails>
        </Accordion>
    );
};

export default TrackImportDetails;
