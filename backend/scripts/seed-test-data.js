// scripts/seed-test-data.js
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "skillscore_dev",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres"
})
const { jobRoles, resumeSnapshots } = require("../test-data/realistic-test-data");

async function seedJobRoles() {
  console.log("[seed] Inserting job roles...");
  
  for (const role of jobRoles) {
    await pool.query(
      `INSERT INTO job_roles (job_role_id, version, title, min_years_of_experience, max_years_of_experience, required_skills)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (job_role_id, version) DO NOTHING`,
      [
        role.jobRoleId,
        role.version,
        role.title,
        role.minYearsOfExperience,
        role.maxYearsOfExperience,
        JSON.stringify(role.requiredSkills)
      ]
    );
  }
  
  console.log(`[seed] ✅ Inserted ${jobRoles.length} job roles`);
}

async function seedResumeSnapshots() {
  console.log("[seed] Inserting resume snapshots...");
  
  for (const resume of resumeSnapshots) {
    await pool.query(
      `INSERT INTO resume_snapshots (resume_snapshot_id, name, skills, years_of_experience, experience)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (resume_snapshot_id) DO NOTHING`,
      [
        resume.resumeSnapshotId,
        resume.name,
        JSON.stringify(resume.skills),
        resume.yearsOfExperience,
        resume.experience
      ]
    );
  }
  
  console.log(`[seed] ✅ Inserted ${resumeSnapshots.length} resume snapshots`);
}

async function main() {
  try {
    await seedJobRoles();
    await seedResumeSnapshots();
    console.log("[seed] 🎉 All test data seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("[seed] ❌ Error:", err);
    process.exit(1);
  }
}

main();