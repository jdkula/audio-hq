DROP TABLE public.delete_job;

DROP TABLE public.job;

DROP FUNCTION public.get_workspace_main_id(ws_row workspace);

DROP TABLE public.play_queue_entry;

DROP INDEX idx_type_workspace_unique;

DROP TABLE public.play_status;

DROP TABLE public.play_status_type_enum;

DROP TRIGGER reconcile_ordering ON public.file;

DROP FUNCTION public.reconcile_ordering();

DROP TABLE public.file;

DROP TABLE public.file_type_enum;

DROP TABLE public.workspace;

