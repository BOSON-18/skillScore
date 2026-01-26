// in persistence there will be only SQL queries and all db related stuff only no business logic , we will cal persistence functions that we are going to export inside the service layer and in service layer result will be returned to the controller layer accordingly

import { Pool } from "pg";; // not query coz we want DI here as glocbal query is not a good for async workers 
import { MatchIdentity } from "../model/matchResultModel/matchResult.types";


export class MatchResultPersistence {
    private readonly pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }


/* Attempt to claim a match for processing 
    returns true -> when worker successfully claimed the job
    return false -> job already claimed by another worker

*/


async  claimMatch( identity: MatchIdentity): Promise<boolean> {


    const sql = `
    INSERT INTO match_results(
    resume_snapshot_id,
    job_role_id,
    job_role_version,
    status
    )
    VALUES($1,$2,$3,'PROCESSING')
    ON CONFLICT (resume_snapshot_id,job_role_id, job_role_version)
    DO NOTHING`;

    const result = await this.pool.query(sql, [
        identity.resumeSnapshotId,
        identity.jobRoleId,
        identity.jobRoleVersion
    ]);

    return result.rowCount === 1;
}


// mark match as avaialable 

 async markAvailable(
    identity: MatchIdentity,
    score: number,
    explaination: unknown
):Promise<boolean>{

    const sql = `
    UPDATE match_results
    SET status='AVAILABLE',
    score = $4,
    explaination = $5,
    updated_at = now()
    WHERE 
    resume_snapshot_id = $1
    AND job_role_id = $2
    AND job_role_version = $3
    AND status = 'PROCESSING'
    `;

    const result = await this.pool.query(sql,[
        identity.resumeSnapshotId,
        identity.jobRoleId,
        identity.jobRoleVersion,
        score,
        explaination
    ]);

    return result.rowCount === 1;
}

// mark as failed 

 async  markFailed(
    identity: MatchIdentity,
    errorReason: string
):Promise<boolean>{

    const sql = `
    UPDATE match_results
    SET
    status='FAILED',
    error_reason = $4,
    updated_at = now()
    WHERE 
    resume_snapshot_id = $1
    AND job_role_id = $2
    AND job_role_version = $3
    AND status = 'PROCESSING'
    `;

    const result = await this.pool.query(sql,[
        identity.resumeSnapshotId,
        identity.jobRoleId,
        identity.jobRoleVersion,
        errorReason
    ]);

    return result.rowCount === 1;
}

}