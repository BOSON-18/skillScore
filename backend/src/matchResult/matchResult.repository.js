
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "skillscore_dev",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres"
})

// this is resposnsible for 
// Idempotency 
// atomic claiming
// safe retries

// Rely on DB constraint not in memory locks

//Claim a match result for processing
// Behavior:
//  * - If no row exists → create PROCESSING row and return true
//  * - If row exists in PROCESSING → return false
//  * - If row exists in AVAILABLE or FAILED → return false

async function claimMatch(identity) {

    const {
        resumeSnapshotId,
        jobRoleId,
        jobRoleVersion
    } = identity;

    const query = `
    INSERT INTO match_results(
    resume_snapshot_id,
    job_role_id,
    job_role_version,
    state)
    VALUES($1,$2,$3,'PROCESSING')
    ON CONFLICT (resume_snapshot_id,job_role_id,job_role_version)
    DO NOTHING
    `;

    const result = await pool.query(
        query,
        [
            resumeSnapshotId, jobRoleId, jobRoleVersion
        ]
    );

    return result.rowCount === 1; // if true means claimed

}

// mark match result available (terminal)
// only possible if state is processing 
// must be idempotent

async function markAvailable(identity, score, explanation) {

    const {
        resumeSnapshotId,
        jobRoleId,
        jobRoleVersion
    } = identity;


    const query = `
    UPDATE match_results
    SET
        state = 'AVAILABLE',
        score = $4,
        explanation= $5,
        updated_at = NOW()
    WHERE
        resume_snapshot_id = $1
        AND job_role_id = $2
        AND job_role_version = $3
        AND state = 'PROCESSING'
    `;

    const result = await pool.query(query, [
        resumeSnapshotId,
        jobRoleId,
        jobRoleVersion,
        score,
        explanation
    ]);

    return result.rowCount === 1;

}

// mark match result failed(terminal)
// only possible if state is processing
// idempotent

async function markFailed(identity, errorReason) {

    const {
        resumeSnapshotId,
        jobRoleId,
        jobRoleVersion
    } = identity;

    const query = `
    UPDATE match_results
    SET
        state='FAILED',
        error_reason=$4,
        updated_at = NOW()
    WHERE
        resume_snapshot_id = $1
        AND job_role_id = $2
        AND job_role_version = $3
        AND state = 'PROCESSING'
    `;

    const result = await pool.query(query,
        [
            resumeSnapshotId,
            jobRoleId,
            jobRoleVersion,
            errorReason
        ]
    );

    return result.rowCount === 1;


}

// find a match result by identity

async function getByIdentity(identity) {

    const {
        resumeSnapshotId,
        jobRoleId,
        jobRoleVersion
    } = identity;


    const query = `
    SELECT 
        resume_snapshot_id,
        job_role_id,
        job_role_version,
        state,
        score,
        explaination,
        error_reason,
        created_at,
        updated_at
     FROM match_results
     WHERE
            resume_snapshot_id = $1
            AND job_role_id = $2
            AND job_role_version = $3
        LIMIT 1    
    `;


    const { rows } = await pool.query(query, [
        resumeSnapshotId,
        jobRoleId,
        jobRoleVersion
    ]);


    if (rows.length === 0) {
        return null;
    }


    return mapRow(rows[0]);

}


function mapRow(row) {
  return {
    resumeSnapshotId: row.resume_snapshot_id,
    jobRoleId: row.job_role_id,
    jobRoleVersion: row.job_role_version,
    state: row.state,
    score: row.score,
    explanation: row.explanation,
    errorReason: row.error_reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}


module.exports = { claimMatch, markAvailable, markFailed, getByIdentity };