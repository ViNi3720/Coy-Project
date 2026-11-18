export const SCHEMA = `
  CREATE TABLE IF NOT EXISTS profiles (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    age        INTEGER NOT NULL,
    photo      TEXT    NOT NULL,
    bio        TEXT,
    city       TEXT,
    interests  TEXT,
    likes_me   INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS swipes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL UNIQUE REFERENCES profiles(id),
    direction  TEXT    NOT NULL CHECK (direction IN ('like', 'pass')),
    created_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS matches (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL UNIQUE REFERENCES profiles(id),
    created_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;
