CREATE TABLE public.workspace
(
    id         uuid        NOT NULL DEFAULT gen_random_uuid(),
    name       text        NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    UNIQUE (id)
);

CREATE TABLE public.file
(
    id           uuid    NOT NULL DEFAULT gen_random_uuid(),
    workspace_id uuid    NOT NULL,
    download_url text    NOT NULL,
    name         text    NOT NULL,
    description  text    NOT NULL DEFAULT '',
    path         jsonb   NOT NULL DEFAULT jsonb_build_array(),
    type         text    NOT NULL,
    length       numeric NOT NULL,
    ordering     bigint           DEFAULT NULL,
    FOREIGN KEY (workspace_id) REFERENCES public.workspace (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (type) REFERENCES public.file_type_enum (value) ON UPDATE CASCADE ON DELETE RESTRICT,
    PRIMARY KEY (id),
    UNIQUE (id)
);

CREATE TABLE public.deck
(
    id              uuid        NOT NULL DEFAULT gen_random_uuid(),
    workspace_id    uuid        NOT NULL,
    created_at      timestamptz NOT NULL DEFAULT now(),
    start_timestamp timestamptz NOT NULL DEFAULT now(),
    pause_timestamp timestamptz          DEFAULT NULL,
    volume          numeric     NOT NULL DEFAULT 1,
    speed           numeric     NOT NULL DEFAULT 1,
    type            text        NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspace (id) ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY (type) REFERENCES public.deck_type_enum (value) ON UPDATE cascade ON DELETE restrict,
    UNIQUE (id),
    CONSTRAINT volume_in_range CHECK (volume >= 0 AND volume <= 1),
    CONSTRAINT speed_in_range CHECK (speed > 0)
);
COMMENT ON TABLE public.deck IS E'one set of tracks playing';

CREATE TABLE public.track
(
    id         uuid        NOT NULL DEFAULT gen_random_uuid(),
    file_id    uuid        NOT NULL,
    deck_id    uuid        NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (file_id) REFERENCES public.file (id) ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY (deck_id) REFERENCES public.deck (id) ON UPDATE cascade ON DELETE cascade
);

CREATE TABLE public.job
(
    id              uuid  NOT NULL DEFAULT gen_random_uuid(),
    name            text  NOT NULL,
    description     text  NOT NULL default '',
    path            jsonb NOT NULL default json_build_array(),
    url             text,
    file_upload     bytea,
    options         jsonb NOT NULL default json_build_object(),
    assigned_worker uuid           DEFAULT NULL,
    progress        numeric        DEFAULT NULL,
    progress_stage  text  NOT NULL DEFAULT 'waiting',
    workspace_id    uuid  NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspace (id) ON UPDATE restrict ON DELETE restrict,
    CONSTRAINT no_empty_jobs CHECK ((file_upload IS NULL) != (url IS NULL)),
    CONSTRAINT file_maximum CHECK ( length(file_upload) <= 1024 * 1024 * 200 ) -- 200MiB
);

CREATE TABLE public.delete_job
(
    id              uuid NOT NULL DEFAULT gen_random_uuid(),
    file_id         uuid NOT NULL,
    assigned_worker uuid          DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (file_id) REFERENCES public.file (id) ON UPDATE restrict ON DELETE cascade
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;
