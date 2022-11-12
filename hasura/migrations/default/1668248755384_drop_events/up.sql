DROP TRIGGER file_update_trigger_delete ON public.file;
DROP TRIGGER file_update_trigger_update ON public.file;
DROP TRIGGER file_update_trigger_insert ON public.file;

DROP TRIGGER track_update_trigger_delete ON public.track;
DROP TRIGGER track_update_trigger_update ON public.track;
DROP TRIGGER track_update_trigger_insert ON public.track;

DROP TRIGGER deck_update_trigger_delete ON public.deck;
DROP TRIGGER deck_update_trigger_update ON public.deck;
DROP TRIGGER deck_update_trigger_insert ON public.deck;

DROP FUNCTION public.create_file_update();
DROP FUNCTION public.create_track_update();
DROP FUNCTION public.create_deck_update();

DROP TABLE public.event;
