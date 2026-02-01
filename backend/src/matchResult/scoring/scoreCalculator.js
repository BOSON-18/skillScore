

// Inputs must be normalized and validated upstrem
// required Skills -> Array name and weight
// role name
// min YOE
// resume snapshot -> normalied skills and yoe of candidates

// Function will return an object {score,metrics}

function calculateScore({ role, resume }) {


    if (!role || !resume) {
        throw new Error("Role and resume are required");
    }

    const {
        requiredSkills,
        minYearsOfExperience,
        maxYearsOfExperience
    } = role;

    const {
        normalizedSkills,
        yearsOfExperience
    } = resume;


    if (!Array.isArray(requiredSkills)) {
        throw new Error("role.requiredSkills must be an array");
    }

    if (!Array.isArray(normalizedSkills)) {
        throw new Error("resume.normalizedSkills must be an array");
    }

    if(typeof yearsOfExperience !=="number" || yearsOfExperience<0){
        throw new Error("resume.yearsOfExperience must be a non-negative number")
    }


    // check for eligibility

    if(typeof minYearsOfExperience === "number" && yearsOfExperience>maxYearsOfExperience){
        // console.log("Candidate OVERQUALIFIED");
        return {
            eligible: false,
            reason: "OVERQUALIFIED"
        }
    }

    let matchedWeight = 0;
    let totalWeight = 0;


    const matchedSkills = [];
    const missingSkills = [];

    for (const skill of requiredSkills) {
        const weight = typeof skill.weight === "number" && skill.weight > 0 ? skill.weight : 1;
        totalWeight += weight;

        if (normalizedSkills.includes(skill.name)) {
            matchedWeight += weight;
            matchedSkills.push(skill.name);
        } else {
            missingSkills.push(skill.name);
        }
    }


    const skillMatchRatio = totalWeight === 0 ? 0 : matchedWeight / totalWeight;
    // console.log("SkillMatchRation ",skillMatchRatio);
    const skillScore = skillMatchRatio * 80;



    // Checking for experience

    let experienceScore = 0;

    if (typeof minYearsOfExperience === "number" ) {
        if(minYearsOfExperience === 0){
            // no penalty to freshers
            experienceScore = 20;
        }
        else if (yearsOfExperience >= minYearsOfExperience) {
            experienceScore = 20
        } else {
            experienceScore = (yearsOfExperience / minYearsOfExperience) * 20;
        }
    } 

    // Seniority Bonus

    const SENIORITY_CAP_YEARS = 5;
    const SENIORIRTY_MAX_BONUS = 10;

    let seniorityBonus = 0;

    if(typeof minYearsOfExperience === "number"){
        const excess = yearsOfExperience - minYearsOfExperience;

        if(excess > 0){
            const effectiveExcess = Math.min(excess,SENIORITY_CAP_YEARS);
            const ratio = effectiveExcess/SENIORITY_CAP_YEARS;
            seniorityBonus = ratio*SENIORIRTY_MAX_BONUS;
        }
    }

    // console.log("Skill score ",skillScore);
    // console.log("experience score ",experienceScore);
    // console.log("Senior Bonus ",seniorityBonus);
    const rawScore = Math.round(skillScore + experienceScore+seniorityBonus);
    const finalScore = Math.min(100,rawScore)
    // console.log("Logging Final score ",finalScore);
    return {
        eligible:true,
        score: finalScore,
        metrics: {
            skillMatch: {
                matched: matchedSkills,
                missing: missingSkills,
                matchedWeight,
                totalWeight
            },
            experience: {
                requiredMin: minYearsOfExperience,
                requiredMax: maxYearsOfExperience ?? null,
                actual: yearsOfExperience,
                delta: yearsOfExperience - minYearsOfExperience
            },
            seniority:{
                bonus : Math.round(seniorityBonus),
                cappedAtYears:SENIORITY_CAP_YEARS
            }
        }
    }
}

module.exports = { calculateScore }