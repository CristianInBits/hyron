CREATE TABLE workouts (
    id               BIGSERIAL      PRIMARY KEY,
    type             VARCHAR(50)    NOT NULL,
    start_date_time  TIMESTAMPTZ    NOT NULL,
    end_date_time    TIMESTAMPTZ,
    global_rpe       INTEGER,
    notes            VARCHAR(4000),
    location         VARCHAR(255),
    source           VARCHAR(255),
    user_id          BIGINT         NOT NULL
);

ALTER TABLE workouts
    ADD CONSTRAINT fk_workouts_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE;

ALTER TABLE workouts
    ADD CONSTRAINT chk_workouts_type
    CHECK (type IN ('HYROX', 'RUN', 'SWIM', 'GYM'));

ALTER TABLE workouts
    ADD CONSTRAINT chk_workouts_global_rpe_range
    CHECK (global_rpe IS NULL OR global_rpe BETWEEN 1 AND 10);

ALTER TABLE workouts
    ADD CONSTRAINT chk_workouts_end_after_start
    CHECK (end_date_time IS NULL OR end_date_time > start_date_time);

CREATE INDEX idx_workouts_user_id ON workouts (user_id);
CREATE INDEX idx_workouts_user_start_date ON workouts (user_id, start_date_time DESC);
CREATE INDEX idx_workouts_user_type ON workouts (user_id, type);