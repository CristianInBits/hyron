CREATE TABLE exercises (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL,
    name          VARCHAR(100) NOT NULL,
    muscle_group  VARCHAR(20) NOT NULL,
    notes         VARCHAR(255),
    is_unilateral BOOLEAN NOT NULL DEFAULT FALSE,
    active        BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE exercises
    ADD CONSTRAINT fk_exercises_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE exercises
    ADD CONSTRAINT chk_exercises_muscle_group
    CHECK (muscle_group IN ('CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'ABS', 'CARDIO', 'FULL_BODY', 'OTHER'));

CREATE UNIQUE INDEX uk_exercises_user_name ON exercises (user_id, LOWER(name)) WHERE active = TRUE;

CREATE INDEX idx_exercises_user ON exercises (user_id);
CREATE INDEX idx_exercises_user_active ON exercises (user_id, active);
CREATE INDEX idx_exercises_user_muscle ON exercises (user_id, muscle_group, active);

CREATE TABLE gym_workout_details (
    id         BIGSERIAL PRIMARY KEY,
    workout_id BIGINT NOT NULL UNIQUE,
    notes      VARCHAR(4000)
);

ALTER TABLE gym_workout_details
    ADD CONSTRAINT fk_gym_details_workout
    FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE;


CREATE TABLE gym_exercises (
    id          BIGSERIAL PRIMARY KEY,
    details_id  BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    order_index INTEGER NOT NULL,
    superset_id VARCHAR(36),
    notes       VARCHAR(1000)
);

ALTER TABLE gym_exercises
    ADD CONSTRAINT fk_gym_exercises_details
    FOREIGN KEY (details_id) REFERENCES gym_workout_details (id) ON DELETE CASCADE;

ALTER TABLE gym_exercises
    ADD CONSTRAINT fk_gym_exercises_catalog
    FOREIGN KEY (exercise_id) REFERENCES exercises (id); 

ALTER TABLE gym_exercises
    ADD CONSTRAINT uk_gym_exercises_order
    UNIQUE (details_id, order_index);

ALTER TABLE gym_exercises
    ADD CONSTRAINT chk_gym_exercises_order_positive
    CHECK (order_index > 0);

CREATE INDEX idx_gym_exercises_details ON gym_exercises (details_id);

CREATE TABLE gym_sets (
    id                BIGSERIAL PRIMARY KEY,
    gym_exercise_id   BIGINT NOT NULL,
    order_index       INTEGER NOT NULL,
    type              VARCHAR(20) NOT NULL,
    weight_kg         DOUBLE PRECISION NOT NULL DEFAULT 0,
    reps              INTEGER,
    rpe               DOUBLE PRECISION,
    rest_seconds      INTEGER,
    execution_seconds INTEGER,
    notes             VARCHAR(500)
);

ALTER TABLE gym_sets
    ADD CONSTRAINT fk_gym_sets_exercise
    FOREIGN KEY (gym_exercise_id) REFERENCES gym_exercises (id) ON DELETE CASCADE;

ALTER TABLE gym_sets
    ADD CONSTRAINT uk_gym_sets_order
    UNIQUE (gym_exercise_id, order_index);

ALTER TABLE gym_sets
    ADD CONSTRAINT chk_gym_sets_type
    CHECK (type IN ('WARMUP', 'WORK', 'FAILURE', 'DROP_SET', 'MYO_REP'));

ALTER TABLE gym_sets
    ADD CONSTRAINT chk_gym_sets_order_positive
    CHECK (order_index > 0);

ALTER TABLE gym_sets
    ADD CONSTRAINT chk_gym_sets_weight_positive
    CHECK (weight_kg >= 0);

ALTER TABLE gym_sets
    ADD CONSTRAINT chk_gym_sets_reps_positive
    CHECK (reps IS NULL OR reps > 0);

ALTER TABLE gym_sets
    ADD CONSTRAINT chk_gym_sets_rpe_range
    CHECK (rpe IS NULL OR (rpe >= 0 AND rpe <= 10));

ALTER TABLE gym_sets
    ADD CONSTRAINT chk_gym_sets_time_positive
    CHECK (execution_seconds IS NULL OR execution_seconds > 0);

ALTER TABLE gym_sets
    ADD CONSTRAINT chk_gym_sets_content_valid
    CHECK (reps IS NOT NULL OR execution_seconds IS NOT NULL);

CREATE INDEX idx_gym_sets_exercise ON gym_sets (gym_exercise_id);