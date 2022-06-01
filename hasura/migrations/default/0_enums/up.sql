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
