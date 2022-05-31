DROP TRIGGER job_update_event ON public.job;
DROP TRIGGER file_update_event ON public.file;
DROP TRIGGER status_update_event ON public.play_status;
DROP FUNCTION public.create_event();
DROP TABLE public.event;
DROP TABLE public.delete_job;

DROP TABLE public.job;

DROP FUNCTION public.get_workspace_main_id(ws_row workspace);

DROP TABLE public.play_queue_entry;

DROP TRIGGER ensure_main_entry_trigger ON public.play_status;
DROP FUNCTION public.ensure_main_entry();

DROP TABLE public.play_status;

DROP TABLE public.play_status_type_enum;

DROP TRIGGER reconcile_ordering ON public.file;
DROP FUNCTION public.order_is_reconciled();
DROP FUNCTION public.reconcile_ordering();

DROP TABLE public.file;

DROP TABLE public.file_type_enum;

DROP TABLE public.workspace;

