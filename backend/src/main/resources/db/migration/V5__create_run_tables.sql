CREATE TABLE run_workout_details (
    id                    BIGSERIAL PRIMARY KEY,
    workout_id            BIGINT NOT NULL UNIQUE,
    shoe_id               BIGINT,
    total_distance_meters INTEGER,
    total_elevation_gain  INTEGER,
    average_hr            INTEGER,
    notes                 VARCHAR(4000)
);

ALTER TABLE run_workout_details
    ADD CONSTRAINT fk_run_details_workout
    FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE;

ALTER TABLE run_workout_details
    ADD CONSTRAINT fk_run_details_shoe
    FOREIGN KEY (shoe_id) REFERENCES shoes (id) ON DELETE SET NULL;

ALTER TABLE run_workout_details
    ADD CONSTRAINT chk_run_details_distance_positive
    CHECK (total_distance_meters IS NULL OR total_distance_meters > 0);

ALTER TABLE run_workout_details
    ADD CONSTRAINT chk_run_details_elevation_not_negative
    CHECK (total_elevation_gain IS NULL OR total_elevation_gain >= 0);

ALTER TABLE run_workout_details
    ADD CONSTRAINT chk_run_details_hr_positive
    CHECK (average_hr IS NULL OR average_hr > 0);

CREATE INDEX idx_run_details_shoe ON run_workout_details (shoe_id);

CREATE TABLE run_intervals (
    id               BIGSERIAL PRIMARY KEY,
    run_details_id   BIGINT NOT NULL,
    order_index      INTEGER NOT NULL,
    type             VARCHAR(20) NOT NULL,
    distance_meters  INTEGER,
    duration_seconds INTEGER NOT NULL,
    average_hr       INTEGER,
    cadence_spm      INTEGER,
    elevation_gain   INTEGER,
    notes            VARCHAR(4000)
);

ALTER TABLE run_intervals
    ADD CONSTRAINT fk_run_intervals_details
    FOREIGN KEY (run_details_id) REFERENCES run_workout_details (id) ON DELETE CASCADE;

ALTER TABLE run_intervals
    ADD CONSTRAINT uk_run_intervals_details_order
    UNIQUE (run_details_id, order_index);

ALTER TABLE run_intervals
    ADD CONSTRAINT chk_run_intervals_type
    CHECK (type IN ('WARMUP', 'WORK', 'REST', 'COOLDOWN', 'OTHER'));

ALTER TABLE run_intervals
    ADD CONSTRAINT chk_run_intervals_order_positive
    CHECK (order_index > 0);

ALTER TABLE run_intervals
    ADD CONSTRAINT chk_run_intervals_distance_not_negative
    CHECK (distance_meters IS NULL OR distance_meters >= 0);

ALTER TABLE run_intervals
    ADD CONSTRAINT chk_run_intervals_duration_positive
    CHECK (duration_seconds > 0);

ALTER TABLE run_intervals
    ADD CONSTRAINT chk_run_intervals_hr_positive
    CHECK (average_hr IS NULL OR average_hr > 0);

ALTER TABLE run_intervals
    ADD CONSTRAINT chk_run_intervals_cadence_positive
    CHECK (cadence_spm IS NULL OR cadence_spm > 0);

ALTER TABLE run_intervals
    ADD CONSTRAINT chk_run_intervals_elevation_not_negative
    CHECK (elevation_gain IS NULL OR elevation_gain >= 0);

CREATE INDEX idx_run_intervals_details ON run_intervals (run_details_id);