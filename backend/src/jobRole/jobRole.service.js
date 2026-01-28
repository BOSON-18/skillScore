const { InvalidJobRoleInputError, JobRoleNotFoundError } = require("./jobROle.errors");
const { createJobRole } = require("./jobRole.model");
const { normalizeJobRoleDefination, fingerprintJobRoleDefination } = require("./jobRole.normalizer");
const { getLatestJobRoleVersion, savejobRole, getJobRoleByVersion: getJobRole } = require("./jobRole.repository");


// input -> object
// jobRoleId, title string
// array -> skills
// returns Promis<Object> -> created JobRole Snapshot

async function createNewJobRoleVersion(input) {

    const { jobRoleId, title, minYearsOfExperience , requiredSkills } = input;

    console.log("YOE in service" , minYearsOfExperience)

    if (!jobRoleId || !title || !requiredSkills || !minYearsOfExperience) {
        throw new Error("Invalid job role input");
    }

    const normalizedIncoming = normalizeJobRoleDefination({
        title, minYearsOfExperience, requiredSkills
    });

    const incomingFingerprint = fingerprintJobRoleDefination(normalizedIncoming);

    const latestRole = await getLatestJobRoleVersion(jobRoleId);

    // TODO: Persist Hash alsofor O(1) comparison and uniqueness
    if (latestRole) {

        console.log("Checking latest Role: ",latestRole);
        const normalizedLatest = normalizeJobRoleDefination({
            title: latestRole.title,
            minYearsOfExperience:latestRole.minYearsOfExperience,
            requiredSkills: latestRole.requiredSkills
        })

        const latestFingerprint = fingerprintJobRoleDefination(normalizedLatest);
            
        if (incomingFingerprint === latestFingerprint) {

            console.log("Latest role is same as input")
            return latestRole;
        }
    }

    const nextVersion = latestRole ? latestRole.version + 1 : 1;

    const jobRole = createJobRole({
        jobRoleId,
        version: nextVersion,
        title,
        minYearsOfExperience,
        requiredSkills
    })

    await savejobRole(jobRole);

    return jobRole;


}


// jobRoleId -> string , version -> number
//  Output Promise<Object|null>
async function getJobRoleByVersion(jobRoleId, version) {
    if (!jobRoleId) {
        throw new InvalidJobRoleInputError("jobRoleId is required");
    }

    if (typeof version !== "number" || version <= 0) {
        throw new InvalidJobRoleInputError("Version must be a positive number");
    }




    const role = await getJobRole(jobRoleId, version);
    console.log("Checking role ",role)
    if (role === null) {
        throw new InvalidJobRoleInputError(
            `Job role ${jobRoleId} version ${version} not found`
        );
    }

    return role;
}


async function getLatestJobRole(jobRoleId) {
    if (!jobRoleId) {
        throw new InvalidJobRoleInputError("jobRoleId is required");
    }

    const role = await getLatestJobRoleVersion(jobRoleId);

    if (!role) {
        throw new JobRoleNotFoundError(
            `Job role ${jobRoleId} not found`
        );
    }

    return role;
}
module.exports = { getJobRoleByVersion, createNewJobRoleVersion, getLatestJobRole };