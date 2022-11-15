CREATE
OR REPLACE FUNCTION public.claim_job(worker_id uuid) RETURNS job AS $$
DECLARE
    _job job;
BEGIN
    WITH limiter AS (SELECT job.id
                     FROM job
                              LEFT OUTER JOIN public.workers w on w.id = job.assigned_worker
                     WHERE assigned_worker IS NULL
                        OR EXTRACT(EPOCH FROM (now() - w.last_check_in)) > 60        -- >60s since worker check-in
                        OR EXTRACT(EPOCH FROM (now() - job.assign_time)) > (60 * 30) -- >30m since assigned
                     LIMIT 1
                     FOR UPDATE OF job)
    UPDATE job
    SET assigned_worker = worker_id,
        assign_time     = now(),
        status          = 'assigned',
        progress        = 0
    FROM limiter
    WHERE job.id = limiter.id
    RETURNING * INTO _job;

    RETURN _job;
END;
$$ LANGUAGE plpgsql;


CREATE
OR REPLACE FUNCTION public.claim_delete_job(worker_id uuid) RETURNS delete_job AS $$
DECLARE
    _job delete_job;
BEGIN
    WITH limiter AS (SELECT id
                     FROM delete_job
                     WHERE assigned_worker IS NULL
                     LIMIT 1
                     FOR UPDATE OF delete_job)
    UPDATE delete_job
    SET assigned_worker = worker_id,
        status          = 'assigned'
    FROM limiter
    WHERE delete_job.id = limiter.id
    RETURNING * INTO _job;

    RETURN _job;
END;
$$ LANGUAGE plpgsql;


CREATE
OR REPLACE FUNCTION public.available_jobs() RETURNS SETOF job AS $$
BEGIN
    RETURN QUERY SELECT job.*
        FROM job
                LEFT OUTER JOIN public.workers w on w.id = job.assigned_worker
        WHERE assigned_worker IS NULL
            OR EXTRACT(EPOCH FROM (now() - w.last_check_in)) > 60        -- >60s since worker check-in
            OR EXTRACT(EPOCH FROM (now() - job.assign_time)) > (60 * 30) -- >30m since assigned
        ORDER BY job.assign_time NULLS LAST, job.created_at;
                     
END;
$$ LANGUAGE plpgsql STABLE;


DROP FUNCTION
  public.prune_workers()