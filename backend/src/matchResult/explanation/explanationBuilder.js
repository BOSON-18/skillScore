// Rule-based explaination builder
// Deterministic no llm no I/O

function buildExplanation({ role, result }) {

    if (!result) {
        throw new Error("result is required");
    }

    if (result.eligible === false) {
        return buildIneligibleExplanation(result.reason, role);
    }
    const { metrics, score } = result;
    const parts = [];

    const { matched, missing } = metrics.skillMatch;

    if (matched.length > 0) {
        parts.push(
            `Matched ${matched.length} required skill(s): ${matched.join(", ")}.`
        );
    }

    if (missing.length > 0) {
        parts.push(
            `Missing ${missing.length} required skill(s): ${missing.join(", ")}.`
        );
    }


    // Experience Explaination

    const exp = metrics.experience;

    if (exp.requiredMin === 0) {
        parts.push(
            `The role is open to freshers, experience did not restrict the score.`
        );
    } else if (exp.actual >= exp.requiredMin) {
        parts.push(
            `Meets the minimum expereince requirement with ${exp.actual} years(s).`
        );
    } else {
        parts.push(
            `Has ${exp.actual} year(s) of experience against a requirement of ${exp.requiredMin}.`
        );
    }

    // Explain seniority

    if (metrics.seniority.bonus > 0) {
        parts.push(
            `Additional experience contributed a small seniority bonus.`
        )
    }

    parts.push(`Final score: ${score}/100.`);


    return {
        summary: parts.join(" "),
        details: {
            matchedSkills: matched,
            missingSkills: missing,
            experience: exp,
            seniority: metrics.seniority,
            score
        }
    };
}



function buildIneligibleExplanation(reason, role) {

    if (reason === "OVERQUALIFIED") {
        return {
            summary: " The candidate exceeds the maximum experience range for this role.",
            details: {
                maxYearsOfExperience: role?.maxYearsOfExperience ?? null
            }
        }
    }

    return {
        summary: "The candidate is not eligible for this role.",
        details: { reason }
    };
}

module.exports = { buildExplanation };