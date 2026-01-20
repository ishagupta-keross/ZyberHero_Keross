-- Add address and device_id columns to safe_zones table
ALTER TABLE safe_zones ADD COLUMN IF NOT EXISTS address VARCHAR(500);
ALTER TABLE safe_zones ADD COLUMN IF NOT EXISTS device_id BIGINT;

-- Add index on device_id
CREATE INDEX IF NOT EXISTS idx_safe_zones_device_id ON safe_zones(device_id);

-- Make existing columns NOT NULL if they aren't already
ALTER TABLE safe_zones ALTER COLUMN child_id SET NOT NULL;
ALTER TABLE safe_zones ALTER COLUMN name SET NOT NULL;
ALTER TABLE safe_zones ALTER COLUMN latitude SET NOT NULL;
ALTER TABLE safe_zones ALTER COLUMN longitude SET NOT NULL;
ALTER TABLE safe_zones ALTER COLUMN radius SET NOT NULL;
