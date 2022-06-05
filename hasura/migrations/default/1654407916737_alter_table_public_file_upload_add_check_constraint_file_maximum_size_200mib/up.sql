alter table "public"."file_upload" add constraint "file_maximum_size_200mib" check (length(base64) <= 1024 * 1024 * 200);
