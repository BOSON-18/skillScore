-- migrations/005_create_resume_snapshots.sql

CREATE TABLE IF NOT EXISTS resume_snapshots (
  resume_snapshot_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  skills JSONB NOT NULL,
  years_of_experience INTEGER NOT NULL,
  experience TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_resume_snapshots_years ON resume_snapshots(years_of_experience);