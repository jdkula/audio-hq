-- Prepare to remove/replace [file] relation
DROP TRIGGER
  reconcile_ordering ON public.file;


DROP FUNCTION
  public.order_is_reconciled();


DROP FUNCTION
  public.reconcile_ordering();


-- No more types
ALTER TABLE
  file DROP COLUMN type;


DROP TABLE
  file_type_enum;


-- The currnet "file" is now a "single"
ALTER TABLE
  file RENAME TO single;


ALTER TABLE
  track RENAME COLUMN file_id TO single_id;


ALTER TABLE
  delete_job RENAME COLUMN file_id TO single_id;


-- Create directory entries
CREATE TABLE
  directory_entry (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    workspace_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    name text NOT NULL,
    path jsonb NOT NULL DEFAULT jsonb_build_array(),
    ordering bigint DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (workspace_id) REFERENCES public.workspace (id) ON UPDATE cascade ON DELETE cascade,
    UNIQUE (id)
  );


-- Create table for holding directories (empty now, can add later.)
CREATE TABLE
  folder (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    directory_entry_id uuid NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (id),
    UNIQUE (directory_entry_id),
    FOREIGN KEY (directory_entry_id) REFERENCES directory_entry(id) ON DELETE cascade ON UPDATE cascade
  );


-- Add fk
ALTER TABLE
  single
ADD
  COLUMN directory_entry_id uuid UNIQUE REFERENCES directory_entry(id) ON DELETE cascade ON UPDATE cascade;


-- Recreate triggers
CREATE
OR REPLACE FUNCTION public.reconcile_ordering() RETURNS TRIGGER AS $$
BEGIN
    UPDATE directory_entry
    SET ordering = rows.row_number * 100
    FROM (SELECT directory_entry.id, row_number() over (PARTITION BY workspace_id ORDER BY ordering NULLS LAST) as row_number
          FROM directory_entry) as rows
    WHERE directory_entry.id = rows.id;
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
    FROM (SELECT directory_entry.id,
                 directory_entry.ordering,
                 (row_number() over (PARTITION BY workspace_id ORDER BY ordering NULLS LAST)) *
                 100 AS reconciled_ordering
          FROM directory_entry) as order_check
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
  ON public.directory_entry FOR EACH STATEMENT
  WHEN (NOT public.order_is_reconciled())
EXECUTE
  PROCEDURE public.reconcile_ordering();


COMMENT
  ON TRIGGER reconcile_ordering ON public.directory_entry IS 'trigger to set value of column updated_at to current timestamp on row update';


-- Load data into directory_entry from singles, and then drop redundant columns
WITH
  dirids AS (
    SELECT
      gen_random_uuid() AS directory_entry_id,
      single.id AS single_id,
      single.workspace_id AS workspace_id,
      single.name AS name,
      single.path AS path,
      single.ordering AS ordering
    FROM
      single
  ),
  new_entries AS (
    INSERT INTO
      directory_entry (id, workspace_id, name, path, ordering)
    SELECT
      dirids.directory_entry_id,
      dirids.workspace_id,
      dirids.name,
      dirids.path,
      dirids.ordering
    FROM
      dirids
    RETURNING
      directory_entry.id as directory_entry_id
  )
UPDATE
  single
SET
  directory_entry_id = (
    SELECT
      dirids.directory_entry_id
    FROM
      dirids
    WHERE
      dirids.single_id = single.id
  );


WITH
  dirids AS (
    SELECT
      DISTINCT ON (workspace_id, path) gen_random_uuid() AS directory_entry_id,
      path ->> (jsonb_array_length(path) - 1) AS dirname,
      path - -1 AS dirpath,
      workspace_id AS workspace_id
    FROM
      single
    WHERE
      jsonb_array_length(path) > 0
  ),
  new_entries AS (
    INSERT INTO
      directory_entry(id, workspace_id, name, path, ordering)
    SELECT
      directory_entry_id,
      workspace_id,
      dirname,
      dirpath,
      -10
    FROM
      dirids
    RETURNING
      id
  )
INSERT INTO
  folder (directory_entry_id)
SELECT
  id
FROM
  new_entries;


ALTER TABLE
  single DROP COLUMN name,
  DROP COLUMN ordering,
  DROP COLUMN path,
  DROP COLUMN workspace_id;


-- Now that things are added, set not null.
ALTER TABLE
  single
ALTER COLUMN
  directory_entry_id
SET
  NOT NULL;