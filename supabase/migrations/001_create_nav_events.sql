CREATE TABLE IF NOT EXISTS nav_events (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id    TEXT NOT NULL,
  course_id     TEXT NOT NULL,
  lo_id         TEXT NOT NULL,
  lo_type       TEXT NOT NULL DEFAULT '',
  session_id    UUID NOT NULL,
  ts            TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_ms   INTEGER,
  referrer_lo   TEXT,
  engagement    TEXT NOT NULL DEFAULT 'active'
);

CREATE INDEX IF NOT EXISTS idx_nav_events_course_ts
  ON nav_events (course_id, ts DESC);

CREATE INDEX IF NOT EXISTS idx_nav_events_student_session
  ON nav_events (student_id, session_id, ts);

CREATE INDEX IF NOT EXISTS idx_nav_events_lo
  ON nav_events (course_id, lo_id, ts DESC);

ALTER TABLE nav_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students insert own nav events"
  ON nav_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read nav events"
  ON nav_events FOR SELECT
  USING (true);
