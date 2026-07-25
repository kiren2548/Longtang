-- Migration number: 0002
CREATE TABLE IF NOT EXISTS locations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    building_code TEXT,
    floor TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_locations_category ON locations (category);
CREATE INDEX IF NOT EXISTS idx_locations_name ON locations (name);
