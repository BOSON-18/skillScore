

CREATE TABLE match_results(
    id BIGSERIAL PRIMARY KEY,
    resume_snapshot_id TEXT NOT NULL,
    job_role_id TEXT NOT NULL,
    job_role_version INTEGER NOT NULL,

    state TEXT NOT NULL,

    score NUMERIC,
    explanation JSONB,
    error_reason TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT match_results_identity_unique
    UNIQUE (resume_snapshot_id,job_role_id,job_role_version),

    CONSTRAINT match_results_state_valid
    CHECK(state IN('PROCESSING','AVAILABLE','FAILED')),

    CONSTRAINT match_results_available_requires_score
    CHECK(
        state != 'FAILED' or error_reason IS NOT NULL
    ),

    CONSTRAINT match_results_version_positive
    CHECK (job_role_version>0)
);

CREATE INDEX match_results_identity_idx
ON match_results(resume_snapshot_id,job_role_id,job_role_version);



CREATE INDEX match_results_by_resume_idx
ON match_results(resume_snapshot_id);

CREATE INDEX match_results_by_role_version_idx
ON match_results(job_role_id,job_role_version);