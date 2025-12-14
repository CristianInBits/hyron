-- ============================
--  Workouts indexes
-- ============================

CREATE INDEX idx_workouts_start_date
ON workouts (start_date_time DESC);

CREATE INDEX idx_workouts_user_start_date
ON workouts (user_id, start_date_time DESC);