import Head from "next/head";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { useState } from "react";

import Router from "next/router";

const useStyles = makeStyles(() => ({
    container: {
        display: "grid",
        gridTemplateColumns: "20% 60% 20%",
        gridTemplateRows: "30% 70%",
        gridTemplateAreas: `
            "logo logo   logo"
            ".    portal ."
        `,
        minHeight: "100vh",
        padding: "15%",
    },
    logo: {
        gridArea: "logo",
        textAlign: "center",
    },
    portal: {
        gridArea: "portal",
        display: "grid",
        gridTemplateColumns: "50% 50%",
        gridTemplateRows: "30% 30% 40%",
        gridTemplateAreas: `
            "input input"
            "host  join "
            ".     ."
        `,
        padding: "25% 10%",
        columnGap: "20px",
        rowGap: "10px",
    },
    input: {
        gridArea: "input",
        height: "100%",
    },
    host: {
        gridArea: "host",
    },
    join: {
        gridArea: "join",
    },
}));

export default function Home(): React.ReactElement {
    const classes = useStyles();

    const [text, setText] = useState("");

    function go(location: string) {
        Router.push(location);
    }

    return (
        <Container>
            <Head>
                <title>Audio HQ</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={classes.container}>
                <div className={classes.logo}>
                    <Typography variant="h1">Audio HQ</Typography>
                </div>
                <div className={classes.portal}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        variant="outlined"
                        className={classes.input}
                        label="Workspace Name"
                    />
                    <Button
                        className={classes.host}
                        variant="contained"
                        color="secondary"
                        onClick={() => go(`/workspace/${text}/host`)}
                    >
                        Host
                    </Button>
                    <Button
                        className={classes.join}
                        variant="contained"
                        color="primary"
                        onClick={() => go(`/workspace/${text}`)}
                    >
                        Join
                    </Button>
                </div>
            </main>
        </Container>
    );
}
