import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { makeStyles, Container, AppBar, Toolbar, Typography } from "@material-ui/core";
import Header from "~/components/host/Header";
import NowPlaying from "~/components/host/NowPlaying";
import Explorer from "~/components/host/Explorer";
import Ambience from "~/components/host/Ambience";
import SoundFX from "~/components/host/SoundFX";
import CurrentUsers from "~/components/host/CurrentUsers";
import Workspace from "~/lib/Workspace";
import PropTypes from "prop-types";
import WorkspaceAdapter from "~/lib/WorkspaceAdapter";

export const WorkspaceContext = React.createContext<Workspace | null>(null);

const useStyles = makeStyles(theme => ({
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

const propTypes = {
    workspace: PropTypes.string.isRequired,
};

export default function WorkspaceHost(props: PropTypes.InferProps<typeof propTypes>) {
    const classes = useStyles();

    const workspace = useWorkspace();

    return (
        <WorkspaceContext.Provider value={workspace}>
            <div className={classes.container}>
                <Header />
                <NowPlaying />
                <Explorer />
                <Ambience />
                <SoundFX />
                <CurrentUsers />
            </div>
        </WorkspaceContext.Provider>
    );
}

WorkspaceHost.propTypes = propTypes;

export function getServerSideProps(context) {
    return {
        props: {
            workspace: context.query.id,
        },
    };
}
