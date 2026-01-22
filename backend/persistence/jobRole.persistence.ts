import { query } from "./db"
import { JobRole } from "../model/jobRole.model";
import { NormalizedRequirements } from "../model/jobRole.dto";

// Get Latest Job Role Version 
export async function getlatestJobRoleVersion(
    job_role_id: string
): Promise<JobRole | null> {

    const sql = `
    SELECT 
        job_role_id,
        version,
        title,
        requirements
    FROM job_roles
    WHERE job_role_id = $1
    ORDER BY version DESC
    LIMIT 1
  `;

    const result = await query(sql, [job_role_id]);

    if (result.rowCount === 0) {
        return null;
    }

    const row = result.rows[0];

    return {
        job_role_id: row.job_role_id,
        version: row.version,
        title: row.title,
        requirements: row.requirements
    };
}
// Promise<X|y> either you will get X or Y as output
// Here X = JobRole and Y = null

// Find Latest Role By Hash
export async function findLatestRoleByHash(
    job_role_id: string,
    requirements_hash: string): Promise<JobRole | null> {

    const sql = `
    SELECT
      job_role_id,
      version,
      title,
      requirements
    FROM job_roles
    WHERE job_role_id = $1
      AND requirements_hash = $2
    ORDER BY version DESC
    LIMIT 1
  `;

    const result = await query(sql, [job_role_id, requirements_hash]);

    if (result.rowCount === 0) {
        return null;
    }

    const row = result.rows[0];
    return {
        job_role_id: row.job_role_id,
        version: row.version,
        title: row.title,
        requirements: row.requirements
    };
}

export async function createNewJobRole(
    job_role_id: string,
    title: string,
    requirements: NormalizedRequirements,
    requirements_hash: string
): Promise<JobRole> {

    const sql = `
    INSERT INTO job_roles (
      job_role_id,
      version,
      title,
      requirements,
      requirements_hash
    )
    VALUES ($1, 1, $2, $3, $4)
    RETURNING
      job_role_id,
      version,
      title,
      requirements
  `;

    const result = await query(sql, [
        job_role_id,
        title,
        requirements,
        requirements_hash
    ]);

    const row = result.rows[0];

    return {
        job_role_id: row.job_role_id,
        version: row.version,
        title: row.title,
        requirements: row.requirements
    };
}

// Insert New Role Version
export async function insertNewRoleVersion(
    job_role_id: string,
    title: string,
    requirements: NormalizedRequirements,
    requirements_hash: string
): Promise<JobRole> {

    // compute next_version inside the INSERT to keep it atomis
    // COASLESCE -> returns the first value that is NOT NULL
    const sql = `
    INSERT into job_roles(
    job_role_id,
    version,
    title,
    requirements,
    requirements_hash
    )
    SELECT
    $1,
    COALESCE(MAX(version), 0) + 1,
    $2,
    $3,
    $4
    FROM job_roles
    WHERE job_role_id = $1
    RETURNING
    job_role_id,
    version,
    title,
    requirements
  `;

    const result = await query(sql, [
        job_role_id,
        title,
        requirements,
        requirements_hash
    ]);

    const row = result.rows[0];
    return {
        job_role_id: row.job_role_id,
        version: row.version,
        title: row.title,
        requirements: row.requirements
    };
}