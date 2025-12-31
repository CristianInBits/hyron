-- Swim workout details
CREATE TABLE swim_workout_details (
    id                    BIGSERIAL PRIMARY KEY,
    workout_id            BIGINT NOT NULL UNIQUE,
    pool_type             VARCHAR(20) NOT NULL,
    total_distance_meters INTEGER,
    total_time_seconds    INTEGER,
    notes                 VARCHAR(4000)
);

ALTER TABLE swim_workout_details
    ADD CONSTRAINT fk_swim_details_workout
    FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE;

ALTER TABLE swim_workout_details
    ADD CONSTRAINT chk_swim_details_pool_type
    CHECK (pool_type IN ('SHORT_COURSE', 'LONG_COURSE', 'OPEN_WATER', 'OTHER'));

ALTER TABLE swim_workout_details
    ADD CONSTRAINT chk_swim_details_distance_positive
    CHECK (total_distance_meters IS NULL OR total_distance_meters > 0);

ALTER TABLE swim_workout_details
    ADD CONSTRAINT chk_swim_details_time_positive
    CHECK (total_time_seconds IS NULL OR total_time_seconds > 0);


-- Swim intervals
CREATE TABLE swim_intervals (
    id               BIGSERIAL PRIMARY KEY,
    swim_details_id  BIGINT NOT NULL,
    order_index      INTEGER NOT NULL,
    type             VARCHAR(20) NOT NULL,
    stroke           VARCHAR(20) NOT NULL,
    distance_meters  INTEGER,
    duration_seconds INTEGER,
    rest_seconds     INTEGER,
    rpe              INTEGER,
    equipment        VARCHAR(200),
    notes            VARCHAR(4000)
);

ALTER TABLE swim_intervals
    ADD CONSTRAINT fk_swim_intervals_details
    FOREIGN KEY (swim_details_id) REFERENCES swim_workout_details (id) ON DELETE CASCADE;

ALTER TABLE swim_intervals
    ADD CONSTRAINT uk_swim_intervals_order
    UNIQUE (swim_details_id, order_index);

ALTER TABLE swim_intervals
    ADD CONSTRAINT chk_swim_intervals_type
    CHECK (type IN ('WARMUP', 'WORK', 'DRILL', 'SPRINT', 'REST', 'COOLDOWN', 'OTHER'));

ALTER TABLE swim_intervals
    ADD CONSTRAINT chk_swim_intervals_stroke
    CHECK (stroke IN ('FREESTYLE', 'BACKSTROKE', 'BREASTSTROKE', 'BUTTERFLY', 'MEDLEY', 'KICK', 'DRILL', 'OTHER'));

ALTER TABLE swim_intervals
    ADD CONSTRAINT chk_swim_intervals_order_positive
    CHECK (order_index > 0);

ALTER TABLE swim_intervals
    ADD CONSTRAINT chk_swim_intervals_distance_not_negative
    CHECK (distance_meters IS NULL OR distance_meters >= 0);

ALTER TABLE swim_intervals
    ADD CONSTRAINT chk_swim_intervals_duration_positive
    CHECK (duration_seconds IS NULL OR duration_seconds > 0);

ALTER TABLE swim_intervals
    ADD CONSTRAINT chk_swim_intervals_rest_not_negative
    CHECK (rest_seconds IS NULL OR rest_seconds >= 0);

ALTER TABLE swim_intervals
    ADD CONSTRAINT chk_swim_intervals_rpe_range
    CHECK (rpe IS NULL OR rpe BETWEEN 1 AND 10);

ALTER TABLE swim_intervals
    ADD CONSTRAINT chk_swim_intervals_content_valid
    CHECK (distance_meters IS NOT NULL OR duration_seconds IS NOT NULL);

CREATE INDEX idx_swim_intervals_details ON swim_intervals (swim_details_id);