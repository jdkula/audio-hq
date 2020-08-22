import { useEffect, useState, FunctionComponent, createContext } from 'react';
import { makeStyles } from '@material-ui/core';
import { Header } from '~/components/host/Header';
import { NowPlaying } from '~/components/host/NowPlaying';
import { Explorer } from '~/components/host/Explorer';
import { Ambience } from '~/components/host/Ambience';
import { SoundFX } from '~/components/host/SoundFX';
import { CurrentUsers } from '~/components/host/CurrentUsers';
import { Workspace, WorkspaceResolver } from '~/lib/Workspace';
import { GetServerSideProps } from 'next';
import useWorkspace from '~/lib/useWorkspace';

export const WorkspaceContext = createContext<(Workspace & { resolver: WorkspaceResolver }) | null>(null);

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

    const { workspace, resolve } = useWorkspace(props.workspace);

    const setSong = async (id: string) => {
        resolve({ playing: { id, startTimestamp: Date.now(), pauseTime: Date.now() } });
    };

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.metadata = new MediaMetadata({ title: props.workspace });
        }
    }, [workspace]);

    useEffect(() => {
        if (navigator.mediaSession) {
            navigator.mediaSession.setActionHandler('pause', () => {
                // resolve({ playing: { volume: 0 } });
            });
            navigator.mediaSession.setActionHandler('stop', () => {
                // resolve({ playing: { volume: 0 } });
            });

            navigator.mediaSession.setActionHandler('play', () => {
                resolve({ playing: { pauseTime: null } });
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                resolve({ playing: { startTimestamp: Date.now(), pauseTime: null } });
            });
        }
    }, [resolve]);

    if (!workspace?.state) return null;

    return (
        <WorkspaceContext.Provider
            value={{ name: props.workspace, files: workspace.files, state: workspace.state, resolver: resolve }}
        >
            <div className={classes.container}>
                <Header />
                {workspace.state.playing && (
                    <NowPlaying resolver={(update) => resolve({ playing: update })} state={workspace.state.playing} />
                )}
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
