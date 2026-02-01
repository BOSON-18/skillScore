

const { normalizeResumeForRoleStub } = require("./resumeNormalizer.stub");
const { normalizeResumeForRoleLLM } = require("./resumeNormalizer.llm");
const {callLLM} = require("../../llm/llmClient")
// const USE_LLM_NORMALIZER = process.env.USE_LLM_NORMALIZER === "true";
const USE_LLM_NORMALIZER = true

async function normalizeResumeForRole({ resumeSnapshot, role }) {
// console.log("Using LLM ??? ",USE_LLM_NORMALIZER)
console.log("Inside factory service")
    // if (!USE_LLM_NORMALIZER) {
    //     console.log("USING STUB")
    //     return normalizeResumeForRoleStub({
    //         resumeSnapshot,
    //         role
    //     });
    // }
    console.log("Using LLm")
    try {
        const normalizedResume= await normalizeResumeForRoleLLM({
            resumeSnapshot,
            role,
            callLLM
        })

        console.log("Checking LLm resume in factory ",normalizedResume)

        return normalizedResume;
    } catch (err) {
        //  FALLBACK is LLM not working 
        console.log("LLM BKL",err)
        return normalizeResumeForRoleStub({
            resumeSnapshot,
            role
        })
    }
}

module.exports = { normalizeResumeForRole }