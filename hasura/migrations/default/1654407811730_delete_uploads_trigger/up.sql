CREATE OR REPLACE FUNCTION public.delete_file_upload()
    RETURNS TRIGGER AS
$$
BEGIN
    DELETE FROM public.file_upload
        WHERE file_upload.id = OLD.file_upload_id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER delete_file_uploads
    AFTER DELETE
    ON public.job
    FOR EACH ROW
    WHEN (OLD.file_upload_id IS NOT NULL)
EXECUTE FUNCTION public.delete_file_upload();
