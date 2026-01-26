export type MatchStatus = "PROCESSING" | "AVAILABLE" | "FAILED";

export interface MatchIdentity{
    resumeSnapshotId: string;
    jobRoleId: string;
    jobRoleVersion: number;
}


// this file is created for pure domain objects not for DB so SQL related will be referenced from here