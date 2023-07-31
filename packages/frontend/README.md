# Audio HQ Frontend

Frontend written in Typescript using the Next.js framework and MUI.

Run the following command to develop:

```bash
yarn dev
```

## Environment Variables

Audio HQ's frontend uses the following two environment variables:

```ini
NEXT_PUBLIC_HASURA_URL_HTTP  # Query endpoint for Hasura
NEXT_PUBLIC_HASURA_URL_WS   # Subscription endpoint for Hasura
```

They should be defined at build-time, where they will be in-lined. You can
also provide a `/config.json` served at the root in the following format:

```json
{
    "http": "string",
    "websocket": "string"
}
```

to override the two values above. The Dockerfile makes use of this feature.
