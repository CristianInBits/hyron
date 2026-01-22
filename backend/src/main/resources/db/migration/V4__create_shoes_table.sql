CREATE TABLE shoes (
    -- Identificadores
    id                          BIGSERIAL PRIMARY KEY,
    user_id                     BIGINT NOT NULL,

    -- Información Básica
    brand                       VARCHAR(50) NOT NULL,
    model                       VARCHAR(100) NOT NULL,
    nickname                    VARCHAR(50),
    type                        VARCHAR(20) NOT NULL DEFAULT 'RUNNING', -- Nuevo campo Enum
    
    -- Detalles Visuales y Notas (Nuevos)
    image_url                   VARCHAR(500),
    colorway                    VARCHAR(50),
    notes                       VARCHAR(500),

    -- Métricas de Distancia
    initial_distance_meters     INTEGER NOT NULL DEFAULT 0,
    accumulated_distance_meters INTEGER NOT NULL DEFAULT 0, -- Nuevo (lo que suma la app)
    max_distance_meters         INTEGER,                    -- Nullable (sin límite)
    
    -- Fechas y Estados
    purchase_date               DATE,                       -- Nuevo
    favorite                    BOOLEAN NOT NULL DEFAULT FALSE, -- Nuevo
    active                      BOOLEAN NOT NULL DEFAULT TRUE
);

-- RELACIONES (Foreign Keys)
ALTER TABLE shoes
    ADD CONSTRAINT fk_shoes_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- VALIDACIONES DE DATOS (Check Constraints)

-- 1. Distancias no negativas
ALTER TABLE shoes
    ADD CONSTRAINT chk_shoes_initial_distance_positive
    CHECK (initial_distance_meters >= 0);

ALTER TABLE shoes
    ADD CONSTRAINT chk_shoes_accumulated_distance_positive
    CHECK (accumulated_distance_meters >= 0);

ALTER TABLE shoes
    ADD CONSTRAINT chk_shoes_max_distance_valid
    CHECK (max_distance_meters IS NULL OR max_distance_meters > 0);

-- 2. Integridad del Enum (Opcional pero recomendado)
-- Esto asegura que nadie inserte "FUTBOL" o textos raros en la base de datos
ALTER TABLE shoes
    ADD CONSTRAINT chk_shoes_type_enum
    CHECK (type IN ('RUNNING', 'TRAIL', 'CROSSFIT', 'HYROX', 'WALKING'));

-- ÍNDICES (Performance)
CREATE INDEX idx_shoes_user ON shoes (user_id);
-- Este índice compuesto es vital para tu método getMyShoes(active, date)
CREATE INDEX idx_shoes_user_active_date ON shoes (user_id, active, purchase_date DESC);