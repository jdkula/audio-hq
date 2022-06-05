-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE OR REPLACE FUNCTION public.delete_file_upload()
--     RETURNS TRIGGER AS
-- $$
-- BEGIN
--     DELETE FROM public.file_upload
--         WHERE file_upload.id = OLD.file_upload_id;
-- END;
-- $$ LANGUAGE plpgsql;
--
--
--
-- CREATE TRIGGER delete_file_uploads
--     AFTER DELETE
--     ON public.job
--     FOR EACH ROW
--     WHEN (OLD.file_upload_id IS NOT NULL)
-- EXECUTE FUNCTION public.delete_file_upload();

DROP TRIGGER delete_file_uploads ON public.job;
DROP FUNCTION public.delete_file_upload();