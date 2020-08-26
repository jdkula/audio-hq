import { Box, CircularProgress, CircularProgressProps, IconButton, Paper, Typography } from '@material-ui/core';
import React, { FC, useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FileManagerContext } from '~/lib/useFileManager';
import { File as WSFile } from '~/lib/Workspace';
import styled from 'styled-components';

import PlayArrow from '@material-ui/icons/PlayArrow';
import DeleteForever from '@material-ui/icons/DeleteForever';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import SaveIcon from '@material-ui/icons/Save';
import { toTimestamp } from './AudioControls';

const FileContainer = styled(Paper).attrs({})`
    display: grid;
    grid-template-columns: 2fr 1fr min-content;
    grid-template-rows: auto;
    margin: 0.5rem 1rem;
    border-radius: 9999px;
    padding: 0.25rem 0.25rem;
    transition: background-color 0.25s;
    align-content: center;
    align-items: center;

    &:hover {
        background-color: #eee;
    }
`;

const StatusContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const CircularProgressWithLabel: FC<CircularProgressProps & { value?: number }> = (props) =>
    props.value ? (
        <Box position="relative" display="inline-flex">
            <CircularProgress variant="static" {...props} />
            <Box
                top={0}
                left={0}
                bottom={0}
                right={0}
                position="absolute"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    ) : (
        <CircularProgress {...props} />
    );

const CircularProgressVisibleBackground = styled(CircularProgressWithLabel)`
    & .circle {
        color: #ddd;
    }
`;

const FileEntry: FC<{ file: WSFile; onPlay: () => void; onDelete: () => void; index: number }> = ({
    file,
    onPlay,
    onDelete,
    index,
}) => {
    const fileManager = useContext(FileManagerContext);

    const cached = fileManager.cached.has(file.id);
    const downloadJob = fileManager.fetching.find((job) => ((job.jobId as unknown) as string) === file.id);

    const download = async () => {
        fileManager.song(file.id);
    };

    const save = async () => {
        fileManager.song(file.id, (blob) => {
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank', 'norel noreferrer');
        });
    };

    return (
        <Draggable draggableId={file.id} index={index}>
            {(provided) => (
                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <FileContainer>
                        <div>
                            <IconButton onClick={onPlay}>
                                <PlayArrow />
                            </IconButton>
                            <Typography variant="body1" component="span">
                                {file.name}
                            </Typography>
                        </div>
                        <Box textAlign="right" px={2}>
                            <Typography variant="body1">{toTimestamp(file.length)}</Typography>
                        </Box>
                        <StatusContainer>
                            {downloadJob &&
                                (downloadJob.progress ? (
                                    <CircularProgressVisibleBackground
                                        variant="static"
                                        value={downloadJob.progress * 100}
                                    />
                                ) : (
                                    <CircularProgressVisibleBackground />
                                ))}
                            {cached && (
                                <IconButton onClick={save}>
                                    <SaveIcon />
                                </IconButton>
                            )}
                            {!downloadJob && !cached && (
                                <IconButton onClick={download}>
                                    <DownloadIcon />
                                </IconButton>
                            )}

                            <IconButton onClick={onDelete}>
                                <DeleteForever />
                            </IconButton>
                        </StatusContainer>
                    </FileContainer>
                </div>
            )}
        </Draggable>
    );
};

export default FileEntry;
