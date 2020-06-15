import * as React from "react";
import { createPouchDb } from "~/lib";
import WS from "~/lib/Workspace";
import {useEffect, useRef, useState} from "react";

export default function Workspace(props) {
    const [db, setDb] = useState(null);
    const [workspace, setWorkspace] = useState(new WS(props.workspace));
    const [data, setData] = useState([]);
    const fileInput = useRef(null);


    useEffect(async () => setDb(await createPouchDb(workspace, setData)));

    const add = () => {
        const files = fileInput.current.files;

        if(!files) {
            return;
        }

        workspace.addFile(files.item(0).name, files.item(0))
    }

    const dataDivs = this.state.data.map(stored => {
        if(!stored) {
            return null;
        }
        return <div>
            <span>{stored.name} - {stored.path} - {stored._id}</span>
        </div>;
    })

    return <div>
        <div>Test</div>
        <div>
            {dataDivs}
        </div>
        <div>
            <input ref={fileInput} className="border border-block" type="file"/>
            <button onClick={add}>Upload</button>
        </div>
    </div>;
}

export function getServerSideProps(context) {
    return {
        props: {
            workspace: context.query.id
        }
    }
}
