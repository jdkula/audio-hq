import * as React from "react";
import { useEffect, useRef, useState } from "react";

export default function Workspace(props) {
    return <div>Hello!</div>;
}

export function getServerSideProps(context) {
    return {
        props: {
            workspace: context.query.id,
        },
    };
}
