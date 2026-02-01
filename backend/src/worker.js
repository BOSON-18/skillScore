const {getLatestJobRoleVersion} = require("./jobRole/jobRole.repository");
const {computeAndPersistMatch} = require("./matchResult/matchResult.service");

//  TEMP stub - real service later
console.log("File loaded")
async function fetchResumeSnapshot(resumeSnapshotId){

    // will replace with real fetch or MCP later
    return{
        skills:["React","Javascript"],
        yearsOfExperience: 2
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