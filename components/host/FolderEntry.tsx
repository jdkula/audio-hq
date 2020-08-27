import React, { FC } from 'react';
import FolderIcon from '@material-ui/icons/Folder';
import { Droppable } from 'react-beautiful-dnd';
import { FileContainer } from './FileEntry';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Box, IconButton, Typography } from '@material-ui/core';

const FolderEntry: FC<{ name: string; onClick: () => void; up?: boolean }> = ({ name, onClick, up }) => (
    <Droppable droppableId={up ? '___back___' : name}>
        {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
                <FileContainer onClick={onClick} style={{ cursor: 'pointer' }}>
                    <Box display="flex" alignItems="center">
                        <Box color="black" component="span">
                            <IconButton color="inherit">{up ? <ArrowBackIcon /> : <FolderIcon />}</IconButton>
                        </Box>
                        <Typography variant="body1" component="span">
                            {name}
                        </Typography>
                    </Box>
                    <div style={{ display: 'none' }}>{provided.placeholder}</div>
                </FileContainer>
            </div>
        )}
    </Droppable>
);

export default FolderEntry;
