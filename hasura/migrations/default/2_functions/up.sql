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

CREATE OR REPLACE FUNCTION public.claim_job(worker_id uuid)
    RETURNS job AS
$$
DECLARE
    _job job;
BEGIN
    WITH limiter AS (SELECT id
                     FROM job
                     WHERE assigned_worker IS NULL
                     LIMIT 1)
    UPDATE job
    SET assigned_worker = worker_id
    FROM limiter
    WHERE job.id = limiter.id
    RETURNING * INTO _job;

    RETURN _job;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.claim_delete_job(worker_id uuid)
    RETURNS delete_job AS
$$
DECLARE
    _job delete_job;
BEGIN
    WITH limiter AS (SELECT id
                     FROM delete_job
                     WHERE assigned_worker IS NULL
                     LIMIT 1)
    UPDATE delete_job
    SET assigned_worker = worker_id
    FROM limiter
    WHERE delete_job.id = limiter.id
    RETURNING * INTO _job;

    RETURN _job;
END;
$$ LANGUAGE plpgsql;