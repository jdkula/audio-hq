CREATE TABLE public.workspace
(
    id         text        NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    UNIQUE (id)
);

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

CREATE TRIGGER set_public_workspace_updated_at
    BEFORE UPDATE
    ON public.workspace
    FOR EACH ROW
EXECUTE PROCEDURE public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_workspace_updated_at ON public.workspace
    IS 'trigger to set value of column updated_at to current timestamp on row update';

CREATE TABLE public.file_type_enum
(
    value       text NOT NULL,
    description text NOT NULL,
    PRIMARY KEY (value),
    UNIQUE (value)
);

INSERT INTO public.file_type_enum(value, description)
VALUES (E'audio', E'a single audio file');

INSERT INTO public.file_type_enum(value, description)
VALUES (E'audioset', E'a set of audio files');


CREATE TABLE public.file
(
    id           uuid    NOT NULL DEFAULT gen_random_uuid(),
    workspace_id text    NOT NULL,
    download_url text    NOT NULL,
    name         text    NOT NULL,
    description  text    NOT NULL DEFAULT '',
    path         jsonb   NOT NULL DEFAULT jsonb_build_array(),
    type         text    NOT NULL,
    length       numeric NOT NULL,
    ordering     integer          DEFAULT NULL,
    FOREIGN KEY (workspace_id) REFERENCES public.workspace (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (type) REFERENCES public.file_type_enum (value) ON UPDATE CASCADE ON DELETE RESTRICT,
    PRIMARY KEY (id),
    UNIQUE (id)
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.reconcile_ordering()
    RETURNS TRIGGER AS
$$
DECLARE
    _new record;
BEGIN
    UPDATE file
    SET ordering = rows.row_number * 100
    FROM (SELECT id, row_number() over (PARTITION BY workspace_id ORDER BY ordering NULLS LAST) as row_number
          FROM file) as rows
    WHERE id = rows.id;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reconcile_ordering
    AFTER UPDATE OF ordering OR INSERT
    ON public.file
    FOR EACH STATEMENT
EXECUTE PROCEDURE public.reconcile_ordering();
COMMENT ON TRIGGER reconcile_ordering ON public.file
    IS 'trigger to set value of column updated_at to current timestamp on row update';
CREATE TABLE public.play_status_type_enum
(
    value       text NOT NULL,
    description text NOT NULL,
    PRIMARY KEY (value),
    UNIQUE (value)
);

INSERT INTO public.play_status_type_enum(value, description)
VALUES (E'main', E'the main player');

INSERT INTO public.play_status_type_enum(value, description)
VALUES (E'ambience', E'any ambience');

INSERT INTO public.play_status_type_enum(value, description)
VALUES (E'sfx', E'any ambience');



CREATE TABLE public.play_status
(
    id              uuid        NOT NULL DEFAULT gen_random_uuid(),
    workspace_id    text        NOT NULL,
    start_timestamp timestamptz NOT NULL,
    pause_timestamp timestamptz,
    volume          numeric     NOT NULL,
    speed           numeric     NOT NULL,
    type            text        NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspace (id) ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY (type) REFERENCES public.play_status_type_enum (value) ON UPDATE cascade ON DELETE restrict,
    UNIQUE (id),
    CONSTRAINT volume_in_range CHECK (volume >= 0 AND volume <= 1),
    CONSTRAINT speed_in_range CHECK (speed > 0)
);
COMMENT ON TABLE public.play_status IS E'workspace status';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE UNIQUE INDEX idx_type_workspace_unique ON public.play_status (workspace_id)
    WHERE type = 'main';

CREATE TABLE public.play_queue_entry
(
    id         uuid        NOT NULL DEFAULT gen_random_uuid(),
    file_id    uuid        NOT NULL,
    status_id  uuid        NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (file_id) REFERENCES public.file (id) ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY (status_id) REFERENCES public.play_status (id) ON UPDATE cascade ON DELETE cascade
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE FUNCTION public.get_workspace_main_id(ws_row workspace)
    RETURNS uuid AS
$$
SELECT id
FROM public.play_status
WHERE workspace_id = ws_row.id
  AND type = 'main'
$$ LANGUAGE sql STABLE;

CREATE TABLE public.job
(
    id              uuid    NOT NULL DEFAULT gen_random_uuid(),
    name            text    NOT NULL,
    description     text    NOT NULL default '',
    path            jsonb   NOT NULL default json_build_array(),
    url             text,
    file_upload     bytea,
    options         jsonb   NOT NULL default json_build_object(),
    assigned_worker uuid             DEFAULT NULL,
    progress        numeric NOT NULL,
    progress_stage  text    NOT NULL,
    workspace_id    text    NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspace (id) ON UPDATE restrict ON DELETE restrict,
    CONSTRAINT no_empty_jobs CHECK ((file_upload IS NULL) != (url IS NULL))
);

CREATE TABLE public.delete_job
(
    id              uuid NOT NULL DEFAULT gen_random_uuid(),
    file_id         uuid NOT NULL,
    assigned_worker uuid          DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (file_id) REFERENCES public.file (id) ON UPDATE restrict ON DELETE restrict
);