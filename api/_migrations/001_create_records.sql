CREATE TABLE IF NOT EXISTS global_records (
  id            SERIAL PRIMARY KEY,
  user_id       VARCHAR(36) NOT NULL,
  user_name     VARCHAR(15) NOT NULL,
  table_number  SMALLINT NOT NULL CHECK (table_number BETWEEN 2 AND 9),
  time_ms       INTEGER NOT NULL CHECK (time_ms > 0),
  errors        SMALLINT NOT NULL CHECK (errors >= 0),
  points        INTEGER NOT NULL CHECK (points > 0),
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_records_table_points
  ON global_records (table_number, points ASC);

CREATE INDEX IF NOT EXISTS idx_records_table_user_points
  ON global_records (table_number, user_id, points ASC);
