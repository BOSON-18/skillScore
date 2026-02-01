const {getLatestJobRoleVersion} = require("./jobRole/jobRole.repository");
const {computeAndPersistMatch} = require("./matchResult/matchResult.service");
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "skillscore_dev",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres"
})

//  TEMP stub - real service later
console.log("File loaded")
async function fetchResumeSnapshot(resumeSnapshotId){

    const result = await pool.query(
    `SELECT 
      resume_snapshot_id as "resumeSnapshotId",
      name,
      skills,
      years_of_experience as "yearsOfExperience",
      experience
     FROM resume_snapshots 
     WHERE resume_snapshot_id = $1`,
    [resumeSnapshotId]
  );

  if (result.rows.length === 0) {
    throw new Error(`Resume snapshot not found: ${resumeSnapshotId}`);
  }

  const row = result.rows[0];
  
  return {
    resumeSnapshotId: row.resumeSnapshotId,
    name: row.name,
    skills: row.skills, // Already parsed by pg (JSONB)
    yearsOfExperience: row.yearsOfExperience,
    experience: row.experience
  };
}


async function runWorker({resumeSnapshotId,jobRoleId}){
    console.log("[worker] started",{resumeSnapshotId,jobRoleId});

    // 1-> resolve latest role
    const role = await getLatestJobRoleVersion(jobRoleId);

    if(!role){
        console.error("[worker] role not found");
        return ;
    }
    // 2) Build identity(Critical invariant)
    const identity = {
        resumeSnapshotId,
        jobRoleId,
        jobRoleVersion : role.version
    };

    // 3) Fetch resume snapshot 
    let resumeSnapshot;
    try{
        resumeSnapshot = await fetchResumeSnapshot(resumeSnapshotId);
    }catch(err){
        console.error("[worker] resume fetch failed",err);
        return;
    }

    // 4) Compute and then persist result
    const result = await computeAndPersistMatch({
        identity,
        role,
        resume:resumeSnapshot
    });

     // 5) Log outcome
  console.log("[worker] finished", {
    identity,
    status: result.status
  });

}
// manual invocation
// console.log("[worker] require.main === module:", require.main === module);

if(require.main === module){
    console.log("Running worker")
    runWorker({
        resumeSnapshotId : "resume_123",
        jobRoleId: "backend_dev"
    })
    .then(()=> process.exit(0))
    .catch(err => {
        console.error("[worker] fatal error", err);
        process.exit(1);
    })
}

module.exports = {runWorker}