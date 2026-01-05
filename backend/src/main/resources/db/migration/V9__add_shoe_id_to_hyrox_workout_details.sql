ALTER TABLE hyrox_workout_details
ADD COLUMN shoe_id BIGINT;

ALTER TABLE hyrox_workout_details
ADD CONSTRAINT fk_hyrox_details_shoe
FOREIGN KEY (shoe_id) REFERENCES shoes(id);

CREATE INDEX idx_hyrox_details_shoe ON hyrox_workout_details(shoe_id);