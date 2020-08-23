import { Button, IconButton, TextField } from '@material-ui/core';
import { useContext, FunctionComponent, FC, useState } from 'react';
import { WorkspaceContext } from '~/pages/[id]/host';
import { File } from '~/lib/Workspace';

import PlayArrow from '@material-ui/icons/PlayArrow';
import DeleteForever from '@material-ui/icons/DeleteForever';

import { FileManagerContext } from '~/lib/useFileManager';

const FileEntry: FC<{ file: File; onPlay: () => void; onDelete: () => void }> = ({ file, onPlay, onDelete }) => {
    return (
        <div>
            <span>{file.name}</span>
            <IconButton onClick={onPlay}>
                <PlayArrow />
            </IconButton>
            <IconButton onClick={onDelete}>
                <DeleteForever />
            </IconButton>
        </div>
    );
};

export const Explorer: FunctionComponent<{
    setSong: (id: string) => void;
}> = (props) => {
    const workspace = useContext(WorkspaceContext);
    const fileManager = useContext(FileManagerContext);

    const [url, setUrl] = useState('');
    const [name, setName] = useState('');

    const doPlay = (fileId: string) => {
        return () => {
            props.setSong(fileId);
        };
    };

    const fileButtons = workspace?.files.map((file) => (
        <FileEntry
            file={file}
            onPlay={doPlay(file.id)}
            onDelete={() => fileManager.delete(file.id, workspace.name)}
            key={file.id}
        />
    ));

    return (
        <div style={{ gridArea: 'explorer' }}>
            {fileButtons}
            <Button onClick={() => fileManager.reset()}>Reset</Button>
            Explorer!
            <TextField value={url} onChange={(e) => setUrl(e.target.value)} label="URL" />
            <TextField value={name} onChange={(e) => setName(e.target.value)} label="Name" />
            <Button onClick={() => fileManager.import(workspace!.name, name, url)}>Upload</Button>
            <pre>{JSON.stringify(fileManager.working, undefined, 2)}</pre>
            <pre>{JSON.stringify(fileManager.fetching, undefined, 2)}</pre>
            <pre>{JSON.stringify(fileManager.cached, undefined, 2)}</pre>
        </div>
    );
};
