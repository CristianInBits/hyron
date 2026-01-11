CREATE TABLE hyrox_workout_details (
    id         BIGSERIAL PRIMARY KEY,
    workout_id BIGINT NOT NULL UNIQUE,
    notes      VARCHAR(4000)
);

ALTER TABLE hyrox_workout_details
    ADD CONSTRAINT fk_hyrox_details_workout
    FOREIGN KEY (workout_id)
    REFERENCES workouts (id)
    ON DELETE CASCADE;

CREATE TABLE hyrox_blocks (
    id                    BIGSERIAL PRIMARY KEY,
    hyrox_details_id      BIGINT NOT NULL,
    order_index           INTEGER NOT NULL,
    rest_duration_seconds INTEGER,
    notes                 VARCHAR(4000)
);

ALTER TABLE hyrox_blocks
    ADD CONSTRAINT fk_hyrox_blocks_details
    FOREIGN KEY (hyrox_details_id)
    REFERENCES hyrox_workout_details (id)
    ON DELETE CASCADE;

ALTER TABLE hyrox_blocks
    ADD CONSTRAINT uk_hyrox_blocks_details_order
    UNIQUE (hyrox_details_id, order_index);

ALTER TABLE hyrox_blocks
    ADD CONSTRAINT chk_hyrox_blocks_order_not_negative
    CHECK (order_index > 0);

ALTER TABLE hyrox_blocks
    ADD CONSTRAINT chk_hyrox_blocks_rest_not_negative
    CHECK (rest_duration_seconds IS NULL OR rest_duration_seconds >= 0);

CREATE TABLE hyrox_items (
    id                        BIGSERIAL PRIMARY KEY,
    block_id                  BIGINT NOT NULL,
    order_index               INTEGER NOT NULL,
    station                   VARCHAR(50) NOT NULL,
    duration_seconds          INTEGER NOT NULL,
    recovery_duration_seconds INTEGER,
    distance_meters           INTEGER,
    reps                      INTEGER,
    weight_kg                 DECIMAL(5, 2),
    average_hr                INTEGER,
    rpe                       INTEGER,
    notes                     VARCHAR(4000)
);

ALTER TABLE hyrox_items
    ADD CONSTRAINT fk_hyrox_items_block
    FOREIGN KEY (block_id)
    REFERENCES hyrox_blocks (id)
    ON DELETE CASCADE;

ALTER TABLE hyrox_items
    ADD CONSTRAINT uk_hyrox_items_block_order
    UNIQUE (block_id, order_index);

ALTER TABLE hyrox_items
    ADD CONSTRAINT chk_hyrox_items_station
    CHECK (station IN ('RUN', 'SKI_ERG', 'SLED_PUSH', 'SLED_PULL', 'BURPEE_BROAD_JUMP', 'ROW', 'FARMERS_CARRY', 'SANDBAG_LUNGES', 'WALL_BALLS', 'OTHER'));

ALTER TABLE hyrox_items
    ADD CONSTRAINT chk_hyrox_items_order_not_negative
    CHECK (order_index > 0);

ALTER TABLE hyrox_items
    ADD CONSTRAINT chk_hyrox_items_duration_positive
    CHECK (duration_seconds > 0);

ALTER TABLE hyrox_items
    ADD CONSTRAINT chk_hyrox_items_recovery_not_negative
    CHECK (recovery_duration_seconds IS NULL OR recovery_duration_seconds >= 0);

ALTER TABLE hyrox_items
    ADD CONSTRAINT chk_hyrox_items_distance_positive
    CHECK (distance_meters IS NULL OR distance_meters > 0);

ALTER TABLE hyrox_items
    ADD CONSTRAINT chk_hyrox_items_reps_positive
    CHECK (reps IS NULL OR reps > 0);

ALTER TABLE hyrox_items
    ADD CONSTRAINT chk_hyrox_items_weight_positive
    CHECK (weight_kg IS NULL OR weight_kg > 0);

ALTER TABLE hyrox_items
    ADD CONSTRAINT chk_hyrox_items_avg_hr_positive
    CHECK (average_hr IS NULL OR average_hr > 0);

ALTER TABLE hyrox_items
    ADD CONSTRAINT chk_hyrox_items_rpe_range
    CHECK (rpe IS NULL OR rpe BETWEEN 1 AND 10);

CREATE INDEX idx_hyrox_blocks_details ON hyrox_blocks (hyrox_details_id);
CREATE INDEX idx_hyrox_items_block ON hyrox_items (block_id);