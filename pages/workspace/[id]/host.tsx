import { useEffect, useState, FunctionComponent, createContext } from 'react';
import { makeStyles } from '@material-ui/core';
import { Header } from '~/components/host/Header';
import { NowPlaying } from '~/components/host/NowPlaying';
import { Explorer } from '~/components/host/Explorer';
import { Ambience } from '~/components/host/Ambience';
import { SoundFX } from '~/components/host/SoundFX';
import { CurrentUsers } from '~/components/host/CurrentUsers';
import { Workspace } from '~/lib/Workspace';
import { GetServerSideProps } from 'next';
import useWorkspaceAdaptor from '~/lib/useWorkspaceAdaptor';

export const WorkspaceContext = createContext<Workspace | null>(null);

const useStyles = makeStyles(() => ({
    container: {
        display: 'grid',
        gridTemplateColumns: '50% 30% 20%',
        gridTemplateRows: '65px 40% auto 40%',
        gridTemplateAreas: `
            "header     header   header  "
            "nowplaying explorer explorer"
            "ambience   explorer explorer"
            "ambience   sfx      users   "
        `,
        minHeight: '100vh',
    },
    header: {
        gridArea: 'header',
    },
    nowplaying: {
        gridArea: 'nowplaying',
    },
    explorer: {
        gridArea: 'explorer',
    },
    ambience: {
        gridArea: 'ambience',
    },
    sfx: {
        gridArea: 'sfx',
    },
    users: {
        gridArea: 'users',
    },
}));

const Host: FunctionComponent<{
    workspace: string;
}> = (props) => {
    const classes = useStyles();

    const { workspace, resolve } = useWorkspaceAdaptor(props.workspace);

    const setSong = async (id: string) => {
        resolve({ playing: { id, startTimestamp: Date.now(), pauseTime: Date.now() } });
    };

    if (!workspace?.state) return null;

    return (
        <WorkspaceContext.Provider value={{ name: props.workspace, files: workspace.files, state: workspace.state }}>
            <div className={classes.container}>
                <Header />
                <NowPlaying
                    seek={(to) => resolve({ playing: { startTimestamp: Date.now() - to * 1000 } })}
                    setState={(playing) => resolve({ playing: { pauseTime: playing ? null : Date.now() } })}
                    state={workspace.state}
                    volume={(to) => resolve({ playing: { volume: to } })}
                />
                <Explorer setSong={setSong} />
                <Ambience />
                <SoundFX />
                <CurrentUsers />
            </div>
        </WorkspaceContext.Provider>
    );
};
export default Host;

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            workspace: context.query.id,
        },
    };
};
