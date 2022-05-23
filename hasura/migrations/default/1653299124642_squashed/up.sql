CREATE TABLE "public"."workspace"
(
    "id"         text        NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id"),
    UNIQUE ("id")
);

CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
    RETURNS TRIGGER AS
$$
DECLARE
    _new record;
BEGIN
    _new := NEW;
    _new."updated_at" = NOW();
    RETURN _new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "set_public_workspace_updated_at"
    BEFORE UPDATE
    ON "public"."workspace"
    FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_workspace_updated_at" ON "public"."workspace"
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';

CREATE TABLE "public"."file_type_enum"
(
    "value"       text NOT NULL,
    "description" text NOT NULL,
    PRIMARY KEY ("value"),
    UNIQUE ("value")
);

INSERT INTO "public"."file_type_enum"("value", "description")
VALUES (E'audio', E'a single audio file');

INSERT INTO "public"."file_type_enum"("value", "description")
VALUES (E'audioset', E'a set of audio files');


CREATE TABLE "public"."files"
(
    "id"           uuid    NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" text    NOT NULL,
    "provider_id"  text    NOT NULL,
    "name"         text    NOT NULL,
    "description"  text,
    "path"         jsonb   NOT NULL,
    "type"         text    NOT NULL,
    "length"       numeric NOT NULL,
    FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("type") REFERENCES "public"."file_type_enum" ("value") ON UPDATE CASCADE ON DELETE RESTRICT,
    PRIMARY KEY ("id"),
    UNIQUE ("id")
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "public"."play_status_type_enum"
(
    "value"       text NOT NULL,
    "description" text NOT NULL,
    PRIMARY KEY ("value"),
    UNIQUE ("value")
);

INSERT INTO "public"."play_status_type_enum"("value", "description")
VALUES (E'main', E'the main player');

INSERT INTO "public"."play_status_type_enum"("value", "description")
VALUES (E'ambience', E'any ambience');


CREATE TABLE "public"."play_status"
(
    "id"              uuid        NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id"    text        NOT NULL,
    "start_timestamp" timestamptz NOT NULL,
    "pause_timestamp" timestamptz,
    "volume"          numeric     NOT NULL,
    "speed"           numeric     NOT NULL,
    "type"            text        NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace" ("id") ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY ("type") REFERENCES "public"."play_status_type_enum" ("value") ON UPDATE cascade ON DELETE restrict,
    UNIQUE ("id"),
    CONSTRAINT "volume_in_range" CHECK (volume >= 0 AND volume <= 1),
    CONSTRAINT "speed_in_range" CHECK (speed > 0)
);
COMMENT ON TABLE "public"."play_status" IS E'workspace status';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE UNIQUE INDEX "idx_type_workspace_unique" ON "public"."play_status" ("workspace_id")
    WHERE "type" = 'main';

CREATE TABLE "public"."play_queue"
(
    "id"        uuid NOT NULL DEFAULT gen_random_uuid(),
    "file_id"   uuid NOT NULL,
    "status_id" uuid NOT NULL,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("file_id") REFERENCES "public"."files" ("id") ON UPDATE cascade ON DELETE cascade,
    FOREIGN KEY ("status_id") REFERENCES "public"."play_status" ("id") ON UPDATE cascade ON DELETE cascade
);
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE FUNCTION "public"."get_workspace_main_id"(ws_row workspace)
    RETURNS uuid AS
$$
SELECT "id"
FROM "public"."play_status"
WHERE workspace_id = ws_row.id
  AND type = 'main'
$$ LANGUAGE sql STABLE;

CREATE VIEW "public"."ambience" AS
SELECT *
FROM "play_status"
WHERE type = 'ambience'::text;

CREATE VIEW "public"."main_status" AS
SELECT *
FROM "play_status"
WHERE type = 'main'::text;