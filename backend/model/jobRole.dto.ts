
// structure for requirements
export interface NormalizedRequirements {
    [key: string]: unknown;
}

export interface JobRoleCreateRequestDTO {
    title: string;
    requirements: NormalizedRequirements;
}

export interface JobRoleUpdateRequestDTO {
    job_role_id: string;
    requirements: NormalizedRequirements;
}

// Outcomes
export type JobRoleWriteStatus = "CREATED" | "UPDATED" | "FAILED" | "NO_CHANGE";

// Success Response for create/update

export interface JobRoleWriteSuccessresponse {
    status: JobRoleWriteStatus;
    job_role_id: string;
    version: number;
}

// Failure Response for create/update
export interface JobRoleWriteFailedResponse {
    status: "FAILED";
    reason: string;
}

export type JobRoleWriteResponseDTO = JobRoleWriteSuccessresponse | JobRoleWriteFailedResponse;
