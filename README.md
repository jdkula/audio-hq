# Audio HQ

Audio HQ is a social DJ platform intended for use by Tabletop RPG-ers!

## Application Architecture

Audio HQ has three components: a [frontend](/jdkula/audio-hq/tree/main/frontend) (nextjs), a [backend](/jdkula/audio-hq/tree/main/hasura) (hasura), and [workers](/jdkula/audio-hq/tree/main/worker) (nodejs).
Only the frontend and backend need to be publically accessible, and the frontend is statically hostable!

Hasura provides a GraphQL endpoint and acts as middleware between the frontend and database, making the database
safely publically accessible, so there is no custom backend code (outside of SQL functions and triggers).

When work is requested (e.g. to upload or import a song), workers (which connect to the database independently)
do the job of downloading, converting, and storing that upload in block storage.
