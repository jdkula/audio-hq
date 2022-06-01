CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
    RETURNS TRIGGER AS
$$
DECLARE
    _new record;
BEGIN
    _new := NEW;
    _new.updated_at = NOW();
    RETURN _new;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.reconcile_ordering()
    RETURNS TRIGGER AS
$$
BEGIN
    UPDATE file
    SET ordering = rows.row_number * 100
    FROM (SELECT file.id, row_number() over (PARTITION BY workspace_id ORDER BY ordering NULLS LAST) as row_number
          FROM file) as rows
    WHERE file.id = rows.id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.order_is_reconciled()
    RETURNS bool AS
$$
DECLARE
    _result bool;
BEGIN
    SELECT count(*) = 0
    INTO _result
    FROM (SELECT file.id,
                 file.ordering,
                 (row_number() over (PARTITION BY workspace_id ORDER BY ordering NULLS LAST)) *
                 100 AS reconciled_ordering
          FROM file) as order_check
    WHERE order_check.ordering != order_check.reconciled_ordering;
    RETURN _result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.ensure_main_deck()
    RETURNS TRIGGER AS
$$
BEGIN
    DELETE FROM deck WHERE type = 'main' AND workspace_id = NEW.workspace_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_pause()
    RETURNS TRIGGER AS
$$
DECLARE
    _new deck;
BEGIN
    _new = NEW;
    _new.start_timestamp = OLD.start_timestamp + (now() - OLD.pause_timestamp) / NEW.speed;
    RETURN _new;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION public.update_speed()
    RETURNS TRIGGER AS
$$
DECLARE
    _new deck;
BEGIN
    _new = NEW;
    _new.start_timestamp = now() - (now() - NEW.start_timestamp) * OLD.speed / NEW.speed;
    RETURN _new;
END;
$$ LANGUAGE plpgsql;
