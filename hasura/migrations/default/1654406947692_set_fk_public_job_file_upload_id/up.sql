alter table "public"."job"
  add constraint "job_file_upload_id_fkey"
  foreign key ("file_upload_id")
  references "public"."file_upload"
  ("id") on update restrict on delete restrict;
