-- ============================
--  Core domain: users & workouts
-- ============================

-- Users table
CREATE TABLE users (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    email           VARCHAR(255)    NOT NULL,
    registered_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Email uniqueness (matches uk_users_email from the entity)
ALTER TABLE users
    ADD CONSTRAINT uk_users_email UNIQUE (email);


-- Workouts table
CREATE TABLE workouts (
    id               BIGSERIAL      PRIMARY KEY,
    type             VARCHAR(50)    NOT NULL,           -- WorkoutType as String
    start_date_time  TIMESTAMP      NOT NULL,
    end_date_time    TIMESTAMP,
    global_rpe       INTEGER,
    notes            VARCHAR(4000),
    location         VARCHAR(255),
    source           VARCHAR(255),
    user_id          BIGINT         NOT NULL
);

-- FK to users, with cascade on delete
ALTER TABLE workouts
    ADD CONSTRAINT fk_workouts_user
    FOREIGN KEY (user_id)
    REFERENCES users (id)
    ON DELETE CASCADE;

-- (Optional but recommended) range constraint for global_rpe (1–10)
ALTER TABLE workouts
    ADD CONSTRAINT chk_workouts_global_rpe_range
    CHECK (global_rpe BETWEEN 1 AND 10 OR global_rpe IS NULL);

-- Index to speed up queries by user
CREATE INDEX idx_workouts_user_id ON workouts (user_id);


-- ============================
--  Hyrox domain
-- ============================

-- Hyrox-specific details of a workout
CREATE TABLE hyrox_workout_details (
    id               BIGSERIAL      PRIMARY KEY,
    format           VARCHAR(50),
    strategy_notes   VARCHAR(4000),
    workout_id       BIGINT         NOT NULL
);

-- One-to-one with workouts, unique and cascading on workout deletion
ALTER TABLE hyrox_workout_details
    ADD CONSTRAINT fk_hyrox_details_workout
    FOREIGN KEY (workout_id)
    REFERENCES workouts (id)
    ON DELETE CASCADE;

ALTER TABLE hyrox_workout_details
    ADD CONSTRAINT uk_hyrox_details_workout UNIQUE (workout_id);

CREATE INDEX idx_hyrox_details_workout_id ON hyrox_workout_details (workout_id);


-- Blocks inside a HyroxWorkoutDetails
CREATE TABLE hyrox_blocks (
    id                        BIGSERIAL      PRIMARY KEY,
    order_index               INTEGER        NOT NULL,
    rest_before_block_sec     INTEGER,
    rest_after_block_sec      INTEGER,
    notes                     VARCHAR(2000),
    hyrox_workout_details_id  BIGINT         NOT NULL
);

ALTER TABLE hyrox_blocks
    ADD CONSTRAINT fk_hyrox_blocks_details
    FOREIGN KEY (hyrox_workout_details_id)
    REFERENCES hyrox_workout_details (id)
    ON DELETE CASCADE;

CREATE INDEX idx_hyrox_blocks_details_id ON hyrox_blocks (hyrox_workout_details_id);


-- Items inside a block (RUN or STATION)
CREATE TABLE hyrox_block_items (
    id                     BIGSERIAL      PRIMARY KEY,
    order_index            INTEGER        NOT NULL,
    item_type              VARCHAR(50)    NOT NULL,  -- ItemType: RUN / STATION
    rest_before_item_sec   INTEGER,
    rest_after_item_sec    INTEGER,
    hyrox_block_id         BIGINT         NOT NULL
);

ALTER TABLE hyrox_block_items
    ADD CONSTRAINT fk_hyrox_block_items_block
    FOREIGN KEY (hyrox_block_id)
    REFERENCES hyrox_blocks (id)
    ON DELETE CASCADE;

CREATE INDEX idx_hyrox_block_items_block_id ON hyrox_block_items (hyrox_block_id);


-- Running segments associated with a block item (when item_type = RUN)
CREATE TABLE hyrox_run_segments (
    id             BIGSERIAL      PRIMARY KEY,
    distance       INTEGER        NOT NULL,
    duration_sec   INTEGER        NOT NULL,
    average_pace   VARCHAR(20),
    average_hr     INTEGER,
    notes          VARCHAR(2000),
    block_item_id  BIGINT         NOT NULL
);

ALTER TABLE hyrox_run_segments
    ADD CONSTRAINT uk_hyrox_run_segments_block_item UNIQUE (block_item_id);

ALTER TABLE hyrox_run_segments
    ADD CONSTRAINT fk_hyrox_run_segments_block_item
    FOREIGN KEY (block_item_id)
    REFERENCES hyrox_block_items (id)
    ON DELETE CASCADE;

CREATE INDEX idx_hyrox_run_segments_block_item_id ON hyrox_run_segments (block_item_id);


-- Station entries associated with a block item (when item_type = STATION)
CREATE TABLE hyrox_station_entries (
    id             BIGSERIAL      PRIMARY KEY,
    station        VARCHAR(50)    NOT NULL,    -- HyroxStation as String
    duration_sec   INTEGER        NOT NULL,
    rpe            INTEGER,
    reps           INTEGER,
    distance       INTEGER,
    total_weight   REAL,
    average_power  INTEGER,
    average_hr     INTEGER,
    notes          VARCHAR(2000),
    block_item_id  BIGINT         NOT NULL
);

ALTER TABLE hyrox_station_entries
    ADD CONSTRAINT uk_hyrox_station_entries_block_item UNIQUE (block_item_id);

ALTER TABLE hyrox_station_entries
    ADD CONSTRAINT fk_hyrox_station_entries_block_item
    FOREIGN KEY (block_item_id)
    REFERENCES hyrox_block_items (id)
    ON DELETE CASCADE;

CREATE INDEX idx_hyrox_station_entries_block_item_id ON hyrox_station_entries (block_item_id);


-- ============================
--  Run domain
-- ============================

-- Running-specific details of a workout
CREATE TABLE run_workout_details (
    id                 BIGSERIAL      PRIMARY KEY,
    total_distance     INTEGER,
    total_duration_sec INTEGER,
    average_pace       VARCHAR(50),
    elevation_gain     INTEGER,
    surface_type       VARCHAR(50),
    session_type       VARCHAR(50),
    workout_id         BIGINT         NOT NULL
);

ALTER TABLE run_workout_details
    ADD CONSTRAINT fk_run_details_workout
    FOREIGN KEY (workout_id)
    REFERENCES workouts (id)
    ON DELETE CASCADE;

ALTER TABLE run_workout_details
    ADD CONSTRAINT uk_run_details_workout UNIQUE (workout_id);

CREATE INDEX idx_run_details_workout_id ON run_workout_details (workout_id);


-- Intervals of a running session
CREATE TABLE run_intervals (
    id                       BIGSERIAL      PRIMARY KEY,
    type                     VARCHAR(100),
    order_index              INTEGER        NOT NULL,
    distance                 INTEGER,       -- meters (optional)
    duration_sec             INTEGER,       -- planned duration (s, optional)
    time_sec                 INTEGER,       -- actual time (s, optional)
    average_pace             VARCHAR(20),
    average_hr               INTEGER,
    rpe                      INTEGER,
    notes                    VARCHAR(2000),
    run_workout_details_id   BIGINT         NOT NULL
);

ALTER TABLE run_intervals
    ADD CONSTRAINT fk_run_intervals_run_workout
    FOREIGN KEY (run_workout_details_id)
    REFERENCES run_workout_details (id)
    ON DELETE CASCADE;

CREATE INDEX idx_run_intervals_run_workout_id ON run_intervals (run_workout_details_id);
CREATE INDEX idx_run_intervals_run_workout_order ON run_intervals (run_workout_details_id, order_index);


-- Kilometer splits (or another unit) of a running session
CREATE TABLE run_splits (
    id                       BIGSERIAL      PRIMARY KEY,
    kilometer                INTEGER,
    time_sec                 INTEGER,
    pace                     VARCHAR(20),
    average_hr               INTEGER,
    run_workout_details_id   BIGINT         NOT NULL
);

ALTER TABLE run_splits
    ADD CONSTRAINT fk_run_splits_run_workout
    FOREIGN KEY (run_workout_details_id)
    REFERENCES run_workout_details (id)
    ON DELETE CASCADE;

CREATE INDEX idx_run_splits_run_workout_id ON run_splits (run_workout_details_id);
CREATE INDEX idx_run_splits_run_workout_km ON run_splits (run_workout_details_id, kilometer);


-- ============================
--  Swim domain
-- ============================

-- Swimming-specific details of a workout
CREATE TABLE swim_workout_details (
    id                 BIGSERIAL      PRIMARY KEY,
    total_distance     INTEGER,
    total_duration_sec INTEGER,
    average_pace       VARCHAR(50),
    main_stroke        VARCHAR(50),
    session_type       VARCHAR(50),
    workout_id         BIGINT         NOT NULL
);

ALTER TABLE swim_workout_details
    ADD CONSTRAINT fk_swim_details_workout
    FOREIGN KEY (workout_id)
    REFERENCES workouts (id)
    ON DELETE CASCADE;

ALTER TABLE swim_workout_details
    ADD CONSTRAINT uk_swim_details_workout UNIQUE (workout_id);

CREATE INDEX idx_swim_details_workout_id ON swim_workout_details (workout_id);


-- Sets of a swimming session
CREATE TABLE swim_sets (
    id                        BIGSERIAL      PRIMARY KEY,
    order_index               INTEGER        NOT NULL,
    repetitions               INTEGER,
    distance_per_rep          INTEGER,        -- meters
    target_pace               VARCHAR(50),    -- "1:45/100m"
    total_block_time_sec      INTEGER,        -- seconds
    rest_between_reps_sec     INTEGER,        -- seconds
    notes                     VARCHAR(2000),
    swim_workout_details_id   BIGINT         NOT NULL,
    stroke                    VARCHAR(50)
);

ALTER TABLE swim_sets
    ADD CONSTRAINT fk_swim_sets_swim_workout
    FOREIGN KEY (swim_workout_details_id)
    REFERENCES swim_workout_details (id)
    ON DELETE CASCADE;

CREATE INDEX idx_swim_sets_swim_workout_id ON swim_sets (swim_workout_details_id);
CREATE INDEX idx_swim_sets_swim_workout_order ON swim_sets (swim_workout_details_id, order_index);


-- ============================
--  Gym domain
-- ============================

-- Strength-training-specific details of a workout
CREATE TABLE gym_workout_details (
    id                BIGSERIAL      PRIMARY KEY,
    goal              VARCHAR(255),
    main_muscle_group VARCHAR(50),
    total_volume      INTEGER,
    workout_id        BIGINT         NOT NULL
);

ALTER TABLE gym_workout_details
    ADD CONSTRAINT fk_gym_details_workout
    FOREIGN KEY (workout_id)
    REFERENCES workouts (id)
    ON DELETE CASCADE;

ALTER TABLE gym_workout_details
    ADD CONSTRAINT uk_gym_details_workout UNIQUE (workout_id);

CREATE INDEX idx_gym_details_workout_id ON gym_workout_details (workout_id);


-- Exercises within a gym session
CREATE TABLE gym_exercise_entries (
    id                        BIGSERIAL      PRIMARY KEY,
    order_index               INTEGER,
    exercise_name             VARCHAR(255),
    notes                     VARCHAR(2000),
    muscle_group              VARCHAR(50),
    gym_workout_details_id    BIGINT         NOT NULL
);

ALTER TABLE gym_exercise_entries
    ADD CONSTRAINT fk_gym_exercise_entries_gym_workout
    FOREIGN KEY (gym_workout_details_id)
    REFERENCES gym_workout_details (id)
    ON DELETE CASCADE;

CREATE INDEX idx_gym_exercise_entries_workout_id ON gym_exercise_entries (gym_workout_details_id);
CREATE INDEX idx_gym_exercise_entries_workout_order ON gym_exercise_entries (gym_workout_details_id, order_index);


-- Sets within each exercise
CREATE TABLE gym_sets (
    id                      BIGSERIAL      PRIMARY KEY,
    set_number              INTEGER,
    reps                    INTEGER,
    weight                  REAL,          -- kg
    rpe                     INTEGER,
    rest_after_set_sec      INTEGER,       -- seconds
    completed               BOOLEAN,
    gym_exercise_entry_id   BIGINT         NOT NULL
);

ALTER TABLE gym_sets
    ADD CONSTRAINT fk_gym_sets_exercise_entry
    FOREIGN KEY (gym_exercise_entry_id)
    REFERENCES gym_exercise_entries (id)
    ON DELETE CASCADE;

CREATE INDEX idx_gym_sets_exercise_entry_id ON gym_sets (gym_exercise_entry_id);
CREATE INDEX idx_gym_sets_exercise_entry_set_number ON gym_sets (gym_exercise_entry_id, set_number);
