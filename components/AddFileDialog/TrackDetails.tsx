import { TextField } from '@material-ui/core';
import React, { FC, RefObject } from 'react';
import styled from 'styled-components';

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

    error?: boolean;

    titleRef?: RefObject<HTMLInputElement | null>;
}

const TrackDetails: FC<TrackDetailsProps> = ({
    title,
    setTitle,
    description,
    setDescription,
    file,
    error,
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
