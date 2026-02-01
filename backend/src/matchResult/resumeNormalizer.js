
// Normalize a resume snapshot relative to a job role
// Will use LLm MCP 


function normalizeResumeForRole({ resumeSnapshot, role }) {

    if (!resumeSnapshot) {
        throw new Error("resumeSnapshot is required");
    }

    if (!role) {
        throw new Error("role is required")
    }


    const skills = Array.isArray(resumeSnapshot.skills) ? resumeSnapshot.skills.map(s => String(s).toLowerCase()) : [];

    const yearsOfExperience = typeof resumeSnapshot.yearsOfExperience === "number" && resumeSnapshot.yearsOfExperience >= 0 ? resumeSnapshot.yearsOfExperience : 0;
    // TEMP deterministic behaviour

    return {
        normalizedSkills: skills,
        yearsOfExperience
    };


}


module.exports = { normalizeResumeForRole };