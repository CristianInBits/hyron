CREATE TABLE shoes (
    id                      BIGSERIAL PRIMARY KEY,
    user_id                 BIGINT NOT NULL,
    brand                   VARCHAR(50) NOT NULL,
    model                   VARCHAR(100) NOT NULL,
    nickname                VARCHAR(50),
    initial_distance_meters INTEGER NOT NULL DEFAULT 0,
    max_distance_meters     INTEGER,
    active                  BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE shoes
    ADD CONSTRAINT fk_shoes_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE shoes
    ADD CONSTRAINT chk_shoes_initial_distance_not_negative
    CHECK (initial_distance_meters >= 0);

ALTER TABLE shoes
    ADD CONSTRAINT chk_shoes_max_distance_positive
    CHECK (max_distance_meters IS NULL OR max_distance_meters > 0);

CREATE INDEX idx_shoes_user ON shoes (user_id);
CREATE INDEX idx_shoes_user_active ON shoes (user_id, active);