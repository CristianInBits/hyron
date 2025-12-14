-- ============================
--  Hyrox orderIndex constraints
-- ============================

-- 1) Blocks: order_index must start from 1

ALTER TABLE hyrox_blocks
    DROP CONSTRAINT IF EXISTS chk_hyrox_blocks_order_index_non_negative;

ALTER TABLE hyrox_blocks
    ADD CONSTRAINT chk_hyrox_blocks_order_index_positive
    CHECK (order_index > 0);

-- Unique order per workout details
ALTER TABLE hyrox_blocks
    ADD CONSTRAINT uk_hyrox_blocks_details_order
    UNIQUE (hyrox_workout_details_id, order_index);


-- 2) Block items: order_index must start from 1

ALTER TABLE hyrox_block_items
    DROP CONSTRAINT IF EXISTS chk_hyrox_block_items_order_index_non_negative;

ALTER TABLE hyrox_block_items
    ADD CONSTRAINT chk_hyrox_block_items_order_index_positive
    CHECK (order_index > 0);

-- Unique order per block
ALTER TABLE hyrox_block_items
    ADD CONSTRAINT uk_hyrox_block_items_block_order
    UNIQUE (hyrox_block_id, order_index);
