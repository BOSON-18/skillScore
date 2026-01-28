const crypto = require("crypto")

// normalize a job role defination into a canonical form -> used for comparison and fingerprinting

function normalizeJobRoleDefination(data) {
    // console.log(data)
    // console.log("Checking yoe in normalizer ",data.minYearsOfExperience);
    const { title,minYearsOfExperience, requiredSkills } = data
    if (!title || typeof title !== "string") {
        throw new Error("title is required for normalization");
    }
    if( typeof minYearsOfExperience !== "number" || minYearsOfExperience < 0){
        throw new Error("minYears of experience must be a number");
    }

    if (!Array.isArray(requiredSkills)) {
        throw new Error("requiredSkills must be an array")
    }

    const normalizedTitle = title.trim().toLowerCase();

    const skillMap = new Map();

    for (const skill of requiredSkills) {
        if (!skill || typeof skill.name !== "string") {
            throw new Error("Invalid skill in requiredSkills");
        }

        const name = skill.name.trim().toLowerCase();

        if (!name) continue;

        const weight = typeof skill.weight === "number" && skill.weight > 0 ? skill.weight : 1;


        skillMap.set(name, weight);
    }

    const normalizedSkills = Array.from(skillMap.entries()).map(([name, weight]) => ({ name, weight })).sort((a, b) => a.name.localeCompare(b.name));

    return {
        title: normalizedTitle,
        minYearsOfExperience,
        requiredSkills: normalizedSkills
    };
}


// create a deterministic fingerprint for a job role defination 
// same meaning == same hash

function fingerprintJobRoleDefination(normalizedDefinaion) {
    const serialized = JSON.stringify(normalizedDefinaion);

    return crypto.createHash("sha256").update(serialized).digest("hex");
}


module.exports = {normalizeJobRoleDefination,fingerprintJobRoleDefination};