CREATE TABLE job_roles(
    id BIGSERIAL PRIMARY KEY,
    job_role_id TEXT NOT NULL,
    version INTEGER NOT NULL,
    title TEXT NOT NULL,

    required_skills JSONB NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT job_roles_unique_version
    UNIQUE(job_role_id,version),

    CONSTRAINT job_roles_version_positive
    CHECK (version > 0)

);


CREATE INDEX job_roels_latest_idx
ON job_roles (job_role_id, version DESC);