alter table "public"."job" add constraint "no_empty_jobs" check (((file_upload_id IS NULL) != (url IS NULL)));
