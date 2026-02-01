
function validateNormalizedResume({ output, role }) {
    if (!output || typeof output !== "object") {
        return false;
    }

    const { normalizedSkills, yearsOfExperience } = output;

    if (!Array.isArray(normalizedSkills)) {
        return false;
    }

    const allowedSkills = new Set(
        role.requiredSkills.map(s => s.name)
    );

    for (const skill of normalizedSkills) {
        // check -> candidate can have extra skills
        if (!allowedSkills.has(skill)) return false;
    }

    if(typeof yearsOfExperience !== "number" || yearsOfExperience<0) return false;

    return true;
}


module.exports = {validateNormalizedResume}