
// export const shorthands = undefined;


exports.up = (pgm) => {
    pgm.sql(`
    CREATE TABLE job_roles (
        job_role_id UUID PRIMARY KEY,
        created_at TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE job_role_versions (
        job_role_version_id UUID PRIMARY KEY,
        job_role_id UUID NOT NULL,
        version_number INT NOT NULL,
        normalized_requirements JSONB NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),

        CONSTRAINT fk_job_role
            FOREIGN KEY (job_role_id)
            REFERENCES job_roles(job_role_id),

        CONSTRAINT uq_job_role_version
            UNIQUE (job_role_id, version_number)
    );

    CREATE INDEX idx_job_role_versions_role
    ON job_role_versions (job_role_id);

    CREATE INDEX idx_job_role_versions_latest
    ON job_role_versions (job_role_id, version_number DESC);
  `);
};


exports.down = (pgm) => {
    pgm.sql(`
    DROP TABLE IF EXISTS job_role_versions;
    DROP TABLE IF EXISTS job_roles;
  `);
};
