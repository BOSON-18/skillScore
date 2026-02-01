
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "skillscore_dev",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres"
})


async function getAllJobRoles(){
    const query = "SELECT * FROM job_roles";

   const {rows} =  await pool.query(query,[]);

   return rows;
}


// new Job Role version , does not mutate latest/exsting version
// param jobRoleId -> string
// output Promise<Objcet|null>
async function savejobRole(jobRole) {

    const { jobRoleId, version, title, minYearsOfExperience,maxYearsOfExperience, requiredSkills } = jobRole;

    const query = ` 
    INSERT INTO job_roles(
    job_role_id,
    version,
    title,
    min_years_of_experience,
    max_years_of_experience,
    required_skills)
    VALUES($1,$2,$3,$4,$5,$6)
    `;

    await pool.query(query, [
        jobRoleId, version, title,minYearsOfExperience,maxYearsOfExperience, JSON.stringify(requiredSkills)
    ])

}


// fetch latest job version
//param id -> string
// output Promise<Object|null>
async function getLatestJobRoleVersion(jobRoleId) {

    const query = `
    SELECT job_role_id,
    version,
    title,
    min_years_of_experience,
    max_years_of_experience,
    required_skills
    FROM job_roles
    WHERE job_role_id = $1
    ORDER BY version DESC
    LIMIT 1
    `;

    const { rows } = await pool.query(query, [jobRoleId]);

    if (rows.length === 0) {
        return null;
    }

    return mapRowToJobRole(rows[0]);

}

// fetch specific job role version
// param id -> string, version -> number
// output Promise<Object|null>
async function getJobRoleByVersion(jobRoleId, version) {

    const query = `
    SELECT job_role_id,
    version,
    title,
    min_years_of_experience,
    max_years_of_experience,
    required_skills
    FROM job_roles
    WHERE job_role_id = $1
    AND version = $2
    LIMIT 1
    `;

    const { rows } = await pool.query(query, [jobRoleId, version]);

    if (rows.length === 0) {
        return null;
    }

    return mapRowToJobRole(rows[0]);

}

function mapRowToJobRole(row) {
    return {
        jobRoleId: row.job_role_id,
        version: row.version,
        title: row.title,
        minYearsOfExperience: row.min_years_of_experience,
        maxYearsOfExperience : row.max_years_of_experience,
        requiredSkills: row.required_skills
    }
}

module.exports = { savejobRole, getLatestJobRoleVersion, getJobRoleByVersion , getAllJobRoles};

