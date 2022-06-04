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


CREATE TABLE public.deck_type_enum
(
    value       text NOT NULL,
    description text NOT NULL,
    PRIMARY KEY (value),
    UNIQUE (value)
);

INSERT INTO public.deck_type_enum(value, description)
VALUES (E'main', E'the main player');

INSERT INTO public.deck_type_enum(value, description)
VALUES (E'ambience', E'any ambience');

INSERT INTO public.deck_type_enum(value, description)
VALUES (E'sfx', E'any ambience');

CREATE TABLE public.job_status_enum
(
    value       text NOT NULL,
    description text NOT NULL,
    PRIMARY KEY (value),
    UNIQUE (value)
);

INSERT INTO public.job_status_enum(value, description)
VALUES (E'waiting', E'waiting for a worker');

INSERT INTO public.job_status_enum(value, description)
VALUES (E'assigned', E'assigned to a worker');

INSERT INTO public.job_status_enum(value, description)
VALUES (E'uploading', E'file is being uploaded from the client to the worker');

INSERT INTO public.job_status_enum(value, description)
VALUES (E'downloading', E'worker is downloading the necessary file');

INSERT INTO public.job_status_enum(value, description)
VALUES (E'converting', E'worker is converting the file');

INSERT INTO public.job_status_enum(value, description)
VALUES (E'saving', E'worker is saving the file to its final location');

INSERT INTO public.job_status_enum(value, description)
VALUES (E'done', E'job is done');

INSERT INTO public.job_status_enum(value, description)
VALUES (E'error', E'an error occurred');


