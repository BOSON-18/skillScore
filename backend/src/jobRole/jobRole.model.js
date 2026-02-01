
// does not talk to DB , jobROle snapshot valid, kinda DTO


function createJobRole({ jobRoleId, version, title,minYearsOfExperience,maxYearsOfExperience, requiredSkills  }) {
    if (!jobRoleId) {
        throw new Error("jobnRoleId is required")
    }

    if (typeof version !== "number" || version <= 0) {
        throw new Error("version must be a positive number");
    }

    if (!title || typeof title !== "string") {
        throw new Error("title is required");
    }

    if (!Array.isArray(requiredSkills)) {
        throw new Error("requiredSkills must be an array");
    }
    if (
        typeof minYearsOfExperience !== "number" ||
        minYearsOfExperience < 0
    ) {
        throw new Error("minYearsOfExperience must be a non-negative number");
    }

    if(maxYearsOfExperience !== undefined){
        if(typeof maxYearsOfExperience !== "number" || maxYearsOfExperience < minYearsOfExperience){
            throw new Error("maxYearsOfExperience must be >= minYearsOfExperience")
        }
    }

    // validate skills
    const normalizedSkills = requiredSkills.map((skill) => {

        if (!skill || typeof skill.name !== "string") {
            throw new Error("Each skill must have a name")
        }

        const name = skill.name.trim().toLowerCase();

        if (!name) {
            throw new Error("skill name cannot be empty");
        }

        const weight = typeof skill.weight === "number" && skill.weight > 0 ? skill.weight : 1;

        return {
            name,
            weight
        }
    })

    // object.freeze will create an immutable object 
    return Object.freeze({
        jobRoleId,
        version,
        title,
        minYearsOfExperience,
        maxYearsOfExperience: maxYearsOfExperience ?? null,
        requiredSkills: normalizedSkills
    })
}


module.exports = { createJobRole }