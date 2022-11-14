-- Prepare to remove/replace [directory_entry] relation
DROP TRIGGER
  reconcile_ordering ON public.directory_entry;


DROP FUNCTION
  public.order_is_reconciled();


DROP FUNCTION
  public.reconcile_ordering();


-- Restore deleted enum
CREATE TABLE
  public.file_type_enum (
    value text NOT NULL,
    description text NOT NULL,
    PRIMARY KEY (value),
    UNIQUE (value)
  );


INSERT INTO
  public.file_type_enum(value, description)
VALUES
  (E'audio', E'a single audio file');


INSERT INTO
  public.file_type_enum(value, description)
VALUES
  (E'audioset', E'a set of audio files');


-- Restore deleted columns
ALTER TABLE
  single
ADD
  COLUMN name text,
ADD
  COLUMN ordering bigint DEFAULT NULL,
ADD
  COLUMN path jsonb NOT NULL DEFAULT jsonb_build_array(),
ADD
  COLUMN type text REFERENCES public.file_type_enum (value) ON UPDATE CASCADE ON DELETE RESTRICT,
ADD
  COLUMN workspace_id uuid REFERENCES public.workspace (id) ON UPDATE CASCADE ON DELETE CASCADE;


-- Restore data
WITH
  singleinfo AS (
    SELECT
      single.id AS single_id,
      directory_entry.name AS name,
      directory_entry.path AS path,
      directory_entry.ordering AS ordering,
      directory_entry.workspace_id AS workspace_id
    FROM
      single
      INNER JOIN directory_entry ON single.directory_entry_id = directory_entry.id
  )
UPDATE
  single
SET
  name = (
    SELECT
      singleinfo.name
    FROM
      singleinfo
    WHERE
      singleinfo.single_id = single.id
  ),
  ordering = (
    SELECT
      singleinfo.ordering
    FROM
      singleinfo
    WHERE
      singleinfo.single_id = single.id
  ),
  path = (
    SELECT
      singleinfo.path
    FROM
      singleinfo
    WHERE
      singleinfo.single_id = single.id
  ),
  workspace_id = (
    SELECT
      singleinfo.workspace_id
    FROM
      singleinfo
    WHERE
      singleinfo.single_id = single.id
  ),
  type = 'audio';


-- Restore non-null constraints after data transfer.
ALTER TABLE
  single
ALTER COLUMN
  name
SET
  NOT NULL;


ALTER TABLE
  single
ALTER COLUMN
  workspace_id
SET
  NOT NULL;


ALTER TABLE
  single
ALTER COLUMN
  type
SET
  NOT NULL;


-- Delete tables and relationships
ALTER TABLE
  single DROP COLUMN directory_entry_id;


DROP TABLE
  folder;


DROP TABLE
  directory_entry;


-- Restore old names
ALTER TABLE
  delete_job RENAME COLUMN single_id TO file_id;


ALTER TABLE
  track RENAME COLUMN single_id TO file_id;


ALTER TABLE
  single RENAME TO file;


-- Restore triggers/functions
CREATE
OR REPLACE FUNCTION public.reconcile_ordering() RETURNS TRIGGER AS $$
BEGIN
    UPDATE file
    SET ordering = rows.row_number * 100
    FROM (SELECT file.id, row_number() over (PARTITION BY workspace_id ORDER BY ordering NULLS LAST) as row_number
          FROM file) as rows
    WHERE file.id = rows.id;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE
OR REPLACE FUNCTION public.order_is_reconciled() RETURNS bool AS $$
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
    WHERE order_check.ordering IS DISTINCT FROM order_check.reconciled_ordering;
    RETURN _result;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER
  reconcile_ordering
AFTER
UPDATE
  OF ordering
  OR
INSERT
  ON public.file FOR EACH STATEMENT
  WHEN (NOT public.order_is_reconciled())
EXECUTE
  PROCEDURE public.reconcile_ordering();


COMMENT
  ON TRIGGER reconcile_ordering ON public.file IS 'trigger to set value of column updated_at to current timestamp on row update';