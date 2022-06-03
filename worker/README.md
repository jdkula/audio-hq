# Audio HQ Worker

Required environment variables:
```ini
NEXT_PUBLIC_HASURA_URL_HTTP  # Query endpoint for Hasura
NEXT_PUBLIC_HASURA_URL_WS    # Subscription endpoint for Hasura
S3_BUCKET_NAME               # S3 bucket to store files in
AWS_ACCESS_KEY_ID            # S3 credentials (key id)
AWS_SECRET_ACCESS_KEY        # S3 credentials (key secret)
```