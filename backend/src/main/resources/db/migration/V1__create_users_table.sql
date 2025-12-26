-- Creates the users table.
--
-- This table stores the core user data, including identification,
-- personal information and the registration timestamp.
CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    registered_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enforces uniqueness of the email address across all users.
--
-- This constraint guarantees that no two users can share
-- the same email address.
ALTER TABLE users
    ADD CONSTRAINT uk_users_email UNIQUE (email);