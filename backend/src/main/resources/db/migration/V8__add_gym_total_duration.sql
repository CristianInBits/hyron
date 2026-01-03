-- Añadir campo de duración manual a gym_workout_details
ALTER TABLE gym_workout_details
    ADD COLUMN total_duration_seconds INTEGER;

ALTER TABLE gym_workout_details
    ADD CONSTRAINT chk_gym_details_duration_positive
    CHECK (total_duration_seconds IS NULL OR total_duration_seconds > 0);