const { calculateScore } = require("./scoring/scoreCalculator");
// const { claimMatch } = "./matchResult.repository"
const { buildExplanation } = require("./explanation/explanationBuilder");
const { markFailed, markAvailable, claimMatch } = require("./matchResult.repository");
const { MatchResultErrorReason } = require("./matchResult.errors");
const { MatchResultState } = require("./matchResult.model");
const { normalizeResumeForRole } = require("./normalization/resumeNormalizer.factory");


async function computeAndPersistMatch({ identity, role, resume }) {

    // console.log("Data passed :",identity,role,resume)
    // 1 Claim (idempotency)
    const claimed = await claimMatch(identity);

    if (!claimed) {
        return { status: "SKIPPED" };
    }
    console.log("Claimed")

    // console.log("Snapshot ",resume)

    const normalizedResume =await  normalizeResumeForRole({
        resumeSnapshot:resume,
        role,
        callLLM :null // will get injected by worker 
    });

    console.log("Normalzied Resume ",normalizedResume)

    // 2 Compute Score
    let result;
    try {
        result = calculateScore({ role, resume : normalizedResume });
        console.log("Result ", result)
    } catch (err) {
        console.log("Error ",err)
         await markFailed(identity, MatchResultErrorReason.INTERNAL_ERROR);
  return { status: MatchResultState.FAILED };
    }

    // 3 Eligibility Outcome
    if (result.eligible === false) {
        await markFailed(
            identity,
            result.reason === "OVERQUALIFIED" ? MatchResultErrorReason.OVERQUALIFIED : MatchResultErrorReason.INTERNAL_ERROR
        );

        return { status: MatchResultState.FAILED };
    }

    //  4 Build Explaination
    const explanation = buildExplanation({
        role, result
    });
    console.log("Explanation ",explanation)
    // 5 Persist Success

    await markAvailable(identity, result.score, explanation);

    return { status: MatchResultState.AVAILABLE };
}


module.exports = {computeAndPersistMatch}