const { InvalidJobRoleInputError, JobRoleNotFoundError } = require("./jobROle.errors");
const { createJobRole } = require("./jobRole.model");
const { normalizeJobRoleDefination, fingerprintJobRoleDefination } = require("./jobRole.normalizer");
const { getLatestJobRoleVersion, savejobRole, getJobRoleByVersion: getJobRole } = require("./jobRole.repository");


// input -> object
// jobRoleId, title string
// array -> skills
// returns Promis<Object> -> created JobRole Snapshot

async function createNewJobRoleVersion(input) {

    const { jobRoleId, title, requiredSkills } = input;

    if (!jobRoleId || !title || !requiredSkills) {
        throw new Error("Invalid job role input");
    }

    const normalizedIncoming = normalizeJobRoleDefination({
        title, requiredSkills
    });

    const incomingFingerprint = fingerprintJobRoleDefination(normalizedIncoming);

    const latestRole = await getLatestJobRoleVersion(jobRoleId);

    // TODO: Persist Hash alsofor O(1) comparison and uniqueness
    if (latestRole) {
        const normalizedLatest = normalizeJobRoleDefination({
            title: latestRole.title,
            requiredSkills: latestRole.requiredSkills
        })

        const latestFingerptint = fingerprintJobRoleDefination(normalizedLatest);

        if (incomingFingerprint === latestFingerptint) {
            return latestRole;
        }
    }

    const nextVersion = latestRole ? latestRole + 1 : 1;

    const jobRole = createJobRole({
        jobRoleId,
        version: nextVersion,
        title,
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

    if (!role) {
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

    const role = await getLatestJobRole(jobRoleId);

    if (!role) {
        throw new JobRoleNotFoundError(
            `Job role ${jobRoleId} not found`
        );
    }

    return role;
}
module.exports = { getJobRoleByVersion, createNewJobRoleVersion, getLatestJobRole };