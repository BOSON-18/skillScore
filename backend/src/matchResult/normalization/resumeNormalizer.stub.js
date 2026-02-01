

function normalizeResumeForRoleStub({ resumeSnapshot, role }) {

    if (!resumeSnapshot || !role) {
        throw new Error("resumeSnapshot and role are required");
    }

    const normalizedSkills = Array.isArray(resumeSnapshot.skills) ? resumeSnapshot.skills.map(s => String(s).toLowerCase()) : [];

    const yearsOfExperience = typeof resumeSnapshot.yearsOfExperience === "number" && resumeSnapshot.yearsOfExperience >= 0 ? resumeSnapshot.yearsOfExperience : 0;

    return {
        normalizedSkills,
        yearsOfExperience,
        evidence: {}
    }
}
module.exports = { normalizeResumeForRoleStub }