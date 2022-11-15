ALTER TABLE
  workers
ADD
  COLUMN worker_start timestamptz,
ADD
  COLUMN checkin_frequency_s int;


UPDATE
  workers
SET
  worker_start = last_check_in,
  checkin_frequency_s = 10;


ALTER TABLE
  workers
ALTER COLUMN
  worker_start
SET
  NOT NULL;


ALTER TABLE
  workers
ALTER COLUMN
  checkin_frequency_s
SET
  NOT NULL;