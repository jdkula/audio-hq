import { IconButton } from '@material-ui/core';
import React, { FC, useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FileManagerContext } from '~/lib/useFileManager';
import { File as WSFile } from '~/lib/Workspace';
import styled from 'styled-components';

import PlayArrow from '@material-ui/icons/PlayArrow';
import DeleteForever from '@material-ui/icons/DeleteForever';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import DownloadIcon from '@material-ui/icons/CloudDownload';

const FileContainer = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr min-content;
    grid-template-rows: auto;
`;

const StatusContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
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

    const progress = Math.ceil((downloadJob?.progress ?? 0) * 100);

    const download = async () => {
        if (cached) {
            fileManager.song(file.id, (blob) => {
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank', 'norel noreferrer');
            });
        } else {
            window.open(`/api/files/${file.id}/download`, '_blank', 'norel noreferrer');
        }
    };

    return (
        <Draggable draggableId={file.id} index={index}>
            {(provided) => (
                <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
                    <FileContainer>
                        <div>
                            <MusicNoteIcon />
                            <span>{file.name}</span>
                        </div>
                        <div>
                            {cached && <span>Cached</span>}
                            {downloadJob && <span>Downloading... {progress}%</span>}
                        </div>
                        <StatusContainer>
                            <IconButton onClick={onPlay}>
                                <PlayArrow />
                            </IconButton>
                            <IconButton onClick={download}>
                                <DownloadIcon />
                            </IconButton>
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
