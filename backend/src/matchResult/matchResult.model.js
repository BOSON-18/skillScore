// Rewsult State 

const MatchResultState = Object.freeze({
    PROCESSING: "PROCESSING",
    AVAILABLE: "AVAILABLE",
    FAILED: "FAILED"
})

// Vuild DTO and validate

function buildMatchIdentity({
    resumeSnapshotId,jobRoleId,jobRoleVersion
}){

    if(!resumeSnapshotId || typeof resumeSnapshotId !== "string"){
        throw new Error('resumeSnapshotId is required');
    }

    if(!jobRoleId || typeof jobRoleId !== "string"){
        throw new Error("jobRoleId is required");
    }

    if(typeof jobRoleVersion !=="number" || jobRoleVersion<=0){
        throw new Error("jobRoleVersion must be a positive number");
    }


    return Object.freeze({
        resumeSnapshotId,
        jobRoleId,
        jobRoleVersion
    })
}


// Match Result Immutable object

function createMatchResult({
    identity,
    state,
    score = null,
    explaination = null,
    errorReason = null
}){
    if(!identity){
        throw new Error("identity is required");
    }

    if(!Object.values(MatchResultState).includes(state)){
        throw new Error("Invalid match result state");
    }

    if(state === MatchResultState.AVAILABLE){
        if(typeof score !== "number"){
            throw new Error("score is required for AVAILABLE state");
        }
    }

    if(state === MatchResultState.FAILED){
        if(!errorReason){
            throw new Error("Error reason is required for FAILD state")
        }
    }



    return Object.freeze({
        ...identity, // this will make the final object flat instead of storing it as identitiy:{}
        state,
        score,
        explaination,
        errorReason
    })
}

module.exports = {
  MatchResultState,
  buildMatchIdentity,
  createMatchResult
};