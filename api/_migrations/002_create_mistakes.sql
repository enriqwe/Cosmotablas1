CREATE TABLE IF NOT EXISTS question_mistakes (
  table_number  SMALLINT NOT NULL CHECK (table_number BETWEEN 2 AND 9),
  multiplier    SMALLINT NOT NULL CHECK (multiplier BETWEEN 2 AND 9),
  error_count   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (table_number, multiplier)
);
