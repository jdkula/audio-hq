/**
 * AddFileDialog/TrackDetails.tsx
 * ========================
 * Provides fields to set the title and description of a given track.
 *
 * Optionally displays a warning if the form is incomplete.
 * Optionally displays a placeholder with the file's name.
 */

import { TextField } from '@mui/material';
import React, { FC, RefObject } from 'react';
import styled from '@emotion/styled';

const TrackDetailsBase = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: 0.5rem;
`;

interface TrackDetailsProps {
    file?: File | null;

    title: string;
    setTitle: (title: string) => void;

    description: string;
    setDescription: (title: string) => void;

    incomplete?: boolean;

    titleRef?: RefObject<HTMLInputElement | null>;
}

const TrackDetails: FC<TrackDetailsProps> = ({
    title,
    setTitle,
    description,
    setDescription,
    file,
    incomplete: error,
    titleRef,
}) => {
    return (
        <TrackDetailsBase>
            <TextField
                id="track-title"
                value={title}
                inputRef={titleRef}
                fullWidth
                autoFocus
                required
                variant="outlined"
                onChange={(e) => setTitle(e.target.value)}
                label="Track Title"
                placeholder={file ? file.name : undefined}
                error={error}
                InputLabelProps={
                    file
                        ? {
                              shrink: true,
                          }
                        : undefined
                }
                helperText={error ? 'Please enter a track title!' : undefined}
            />
            <TextField
                id="track-description"
                value={description}
                fullWidth
                size="small"
                variant="outlined"
                onChange={(e) => setDescription(e.target.value)}
                label="Track Description"
            />
        </TrackDetailsBase>
    );
};

export default TrackDetails;
