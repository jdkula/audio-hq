CREATE TRIGGER set_public_workspace_updated_at
    BEFORE UPDATE
    ON public.workspace
    FOR EACH ROW
EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_workspace_updated_at ON public.workspace
    IS 'trigger to set value of column updated_at to current timestamp on row update';

CREATE TRIGGER reconcile_ordering
    AFTER UPDATE OF ordering OR INSERT
    ON public.file
    FOR EACH STATEMENT
    WHEN (NOT public.order_is_reconciled())
EXECUTE PROCEDURE public.reconcile_ordering();
COMMENT ON TRIGGER reconcile_ordering ON public.file
    IS 'trigger to set value of column updated_at to current timestamp on row update';

CREATE TRIGGER ensure_main_deck_trigger
    BEFORE INSERT
    ON public.deck
    FOR EACH ROW
    WHEN (NEW.type = 'main')
EXECUTE FUNCTION public.ensure_main_deck();
