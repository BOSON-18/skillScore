
exports.up = (pgm) => {
    pgm.sql(
        `
        CREATE TABLE resume_snapshots(
        resume_snapshot_id UUID PRIMARY KEY,
        external_resume_id VARCHAR(128) NOT NULL,
        schema_version INT NOT NULL,
        resume_data JSONB NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT now(),
        
        CONSTRAINT uq_resume_external_version
        UNIQUE (external_resume_id,schema_version));
        CREATE INDEX idx_resume_snapshots_external
        ON resume_snapshots (external_resume_id);
        
        `
    )
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE IF EXISTS resume_snapshots;
  `);
};
