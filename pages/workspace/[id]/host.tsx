import * as React from "react";
import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import Header from "~/components/host/Header";
import NowPlaying from "~/components/host/NowPlaying";
import Explorer from "~/components/host/Explorer";
import Ambience from "~/components/host/Ambience";
import SoundFX from "~/components/host/SoundFX";
import CurrentUsers from "~/components/host/CurrentUsers";
import Workspace from "~/lib/Workspace";
import PropTypes from "prop-types";
import WorkspaceAdapter, { useWorkspace } from "~/lib/WorkspaceAdapter";
import AudioGraph from "~/lib/AudioGraph";
import { GetServerSideProps } from "next";
import { functionalComponent } from "~/lib/Utility";

export const WorkspaceContext = React.createContext<Workspace | null>(null);

const useStyles = makeStyles(() => ({
    container: {
        display: "grid",
        gridTemplateColumns: "50% 30% 20%",
        gridTemplateRows: "65px 40% auto 40%",
        gridTemplateAreas: `
            "header     header   header  "
            "nowplaying explorer explorer"
            "ambience   explorer explorer"
            "ambience   sfx      users   "
        `,
        minHeight: "100vh",
    },
    header: {
        gridArea: "header",
    },
    nowplaying: {
        gridArea: "nowplaying",
    },
    explorer: {
        gridArea: "explorer",
    },
    ambience: {
        gridArea: "ambience",
    },
    sfx: {
        gridArea: "sfx",
    },
    users: {
        gridArea: "users",
    },
}));

export default functionalComponent(
    (PropTypes) => ({
        workspace: PropTypes.string.isRequired,
    }),
    (props) => {
        const classes = useStyles();

        const [workspace, setWorkspace] = useWorkspace(props.workspace);

        const [adapter, setAdapter] = useState<WorkspaceAdapter | null>(null);

        useEffect(() => {
            const adapter = WorkspaceAdapter.instance(props.workspace, setWorkspace);
            setAdapter(adapter);
            return () => adapter.close();
        }, []);

        const setSong = async (id: string) => {
            adapter?.updateMain({
                id,
                fileId: null,
            });
        };

        return (
            <WorkspaceContext.Provider value={workspace}>
                <div className={classes.container}>
                    <Header />
                    {adapter && <NowPlaying adapter={adapter} />}
                    <Explorer setSong={setSong} />
                    <Ambience />
                    <SoundFX />
                    <CurrentUsers />
                </div>
            </WorkspaceContext.Provider>
        );
    },
);

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {
            workspace: context.query.id,
        },
    };
};
