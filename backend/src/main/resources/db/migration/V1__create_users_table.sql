CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    registered_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users
    ADD CONSTRAINT uk_users_email UNIQUE (email);