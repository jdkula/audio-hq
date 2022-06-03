import { Button } from '@mui/material';
import { gql } from 'urql';
import { Deck_Type_Enum_Enum, useDecksQuery, usePlayDeckMutation } from '~/lib/generated/graphql';

const yeet = 'ff2e8060-d7c7-4bb7-bdbf-b206a71a7e5c';
const l0 = {
    file_id: '0e1b3c75-c53c-45bf-858e-f7dc6cffca1f',
    ordering: 0,
};

export default function Test() {
    const [, doTest] = usePlayDeckMutation();
    const [decks] = useDecksQuery({ variables: { workspaceId: yeet } });

    const test = () => {
        doTest({
            workspaceId: yeet,
            deck: {
                workspace_id: yeet,
                start_timestamp: new Date().toString(),
                pause_timestamp: new Date().toString(),
                type: Deck_Type_Enum_Enum.Main,
                queue: { data: [l0] },
            },
            isMain: true,
        });
    };
    return (
        <div>
            <Button onClick={test}>x</Button>
            <div>
                <pre>{JSON.stringify(decks.data, null, 4)}</pre>
            </div>
        </div>
    );
}
