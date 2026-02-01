const { validateNormalizedResume } = require("./resumeNormalizer.schema");
const {callLLM} = require("../../llm/llmClient");


async function normalizeResumeForRoleLLM({ resumeSnapshot, role }) {
    if (!callLLM) {
        throw new Error("callLLM is required");
    }

    console.log("[NORMALIZER] checking")

    const allowedSkills = role.requiredSkills.map(s => s.name);
    console.log("[Normalizer] ",allowedSkills)

    const prompt = `
You are a resume normalization engine.

Rules:
- You may ONLY output skills from this list:
  ${allowedSkills.join(", ")}
- Do NOT invent skills
- Do NOT score or rank
- Estimate total years of experience conservatively
- Output STRICT JSON only
- No prose, no markdown

Resume snapshot:
${JSON.stringify(resumeSnapshot, null, 2)}

Output format:
{
  "normalizedSkills": string[],
  "yearsOfExperience": number,
  "evidence": { [skill: string]: string[] }
}
`;

    let raw;
    try {
        console.log("RAW [NORMALIZER}")
        raw = await callLLM(prompt);

        console.log("[Normalizer] raw: ", raw);
    } catch (err) {
        console.log("[NORMALIZER]",err.message)
        throw new Error("LLM call failed");
    }

    let parsed;
    try {
        parsed = JSON.parse(raw);
        console.log("[Normalizer] parsed: ", parsed);
    } catch {
        throw new Error("LLM returned invalid JSON");
    }

    // Normalize deterministically
    const output = {
        normalizedSkills: Array.isArray(parsed.normalizedSkills)
            ? [...new Set(parsed.normalizedSkills.map(s => s.toLowerCase()))]
            : [],
        yearsOfExperience: Number.isInteger(parsed.yearsOfExperience)
            ? parsed.yearsOfExperience
            : Math.floor(parsed.yearsOfExperience || 0),
        evidence: parsed.evidence || {}
    };

    const isValid = validateNormalizedResume({
        output,
        role
    });

    if (!isValid) {
        throw new Error("LLM output failed validation");
    }
    console.log("[Normalizer] output: ", output);
    return output;
}

module.exports = { normalizeResumeForRoleLLM };
