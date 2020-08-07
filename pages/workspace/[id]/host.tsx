import { useEffect, useState, FunctionComponent, createContext } from 'react';
import { makeStyles } from '@material-ui/core';
import { Header } from '~/components/host/Header';
import { NowPlaying } from '~/components/host/NowPlaying';
import { Explorer } from '~/components/host/Explorer';
import { Ambience } from '~/components/host/Ambience';
import { SoundFX } from '~/components/host/SoundFX';
import { CurrentUsers } from '~/components/host/CurrentUsers';
import { Workspace } from '~/lib/Workspace';
import { WorkspaceAdapter, useWorkspace } from '~/lib/WorkspaceAdapter_old';
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

    const adaptor = useWorkspaceAdaptor(props.workspace);

    const setSong = async (id: string) => {
        adaptor.updateMain({ id: id });
    };

    if (adaptor.state === null) return null;

    return (
        <WorkspaceContext.Provider value={{ name: props.workspace, files: adaptor.files, state: adaptor.state }}>
            <div className={classes.container}>
                <Header />
                {adaptor && (
                    <NowPlaying
                        seek={(to) => adaptor.updateMain({ timestamp: to })}
                        setState={(to) => adaptor.updateMain({ paused: !to })}
                        state={adaptor.state}
                        volume={(to) => adaptor.updateMain({ volume: to })}
                    />
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
