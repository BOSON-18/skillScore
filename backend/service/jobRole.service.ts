import { Domain } from "node:domain";
import { DomainError } from "../model/errors/domainError";
import { JobRoleErrorReason } from "../model/errors/error.types";
import { JobRoleCreateRequestDTO, JobRoleUpdateRequestDTO } from "../model/jobRoleModel/jobRole.dto";
import { JobRole } from "../model/jobRole.model";
import { fingerprintRequirements } from "../model/jobRoleModel/requirements.fingerprint";
import { createNewJobRole, findLatestRoleByHash, getlatestJobRoleVersion, insertNewRoleVersion } from "../persistence/jobRole.persistence";


export async function createjobRole(
    req: JobRoleCreateRequestDTO & { job_role_id: string }
): Promise<JobRole> {

    const requirementHash = fingerprintRequirements(req.requirements);

    const existing = await getlatestJobRoleVersion(req.job_role_id);

    if (existing) {
        throw new DomainError(JobRoleErrorReason.SAME_REQUIREMENTS);
    }

    return createNewJobRole(
        req.job_role_id,
        req.title,
        req.requirements,
        requirementHash
    );

}


// Update Job Role by creating new immutable version

export async function updatejobRole(
    req: JobRoleUpdateRequestDTO & { title: string }
): Promise<JobRole> {
    const requirementHash = fingerprintRequirements(req.requirements);
    const latest = await getlatestJobRoleVersion(req.job_role_id);

    if (!latest) {
        throw new DomainError(JobRoleErrorReason.ROLE_NOT_FOUND);
    }

    const same = await findLatestRoleByHash(
        req.job_role_id,
        requirementHash
    );

    if (same) {
        // Business outcome hai not an error (level 2)
        throw new DomainError(JobRoleErrorReason.INVALID_REQUIREMENTS);
    }

    return insertNewRoleVersion(
        req.job_role_id,
        req.title,
        req.requirements,
        requirementHash
    );
}