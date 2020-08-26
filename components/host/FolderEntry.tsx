import React, { FC } from 'react';
import FolderIcon from '@material-ui/icons/Folder';
import { Droppable } from 'react-beautiful-dnd';

const Folder: FC<{ name: string; onClick: () => void }> = ({ name, onClick }) => (
    <Droppable droppableId={name} key={name}>
        {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
                <div onClick={onClick}>
                    <FolderIcon />
                    {name} {provided.placeholder}
                </div>
            </div>
        )}
    </Droppable>
);

export default Folder;
