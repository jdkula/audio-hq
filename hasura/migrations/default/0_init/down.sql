DROP TABLE public.delete_job;

DROP TABLE public.job;

DROP TABLE public.track;

DROP TRIGGER ensure_main_deck_trigger ON public.deck;
DROP FUNCTION public.ensure_main_deck();

DROP TABLE public.deck;

DROP TABLE public.deck_type_enum;

DROP TRIGGER reconcile_ordering ON public.file;
DROP FUNCTION public.order_is_reconciled();
DROP FUNCTION public.reconcile_ordering();

DROP TABLE public.file;

DROP TABLE public.file_type_enum;

DROP TABLE public.workspace;

