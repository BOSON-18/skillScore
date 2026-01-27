

// new Job Role version , does not mutate latest/exsting version
// param jobRoleId -> string
// output Promise<Objcet|null>
async function savejobRole(jobRole) {

}


// fetch latest job version
//param id -> string
// output Promise<Object|null>
async function getLatestJobRoleVersion(jobRoleId) {

}

// fetch specific job role version
// param id -> string, version -> number
// output Promise<Object|null>
async function getJobRoleByVersion(jobRoleId, version) {

}

module.exports = { savejobRole, getLatestJobRoleVersion, getJobRoleByVersion };

