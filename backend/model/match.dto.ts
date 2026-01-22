

export interface MatchRequestDTO{
    resume_snapshot_id:string;
    job_role_id:string;
}

export type MatchStatus = "PROCESSING" | "AVAILABLE" | "FAILED";


export interface MatchAvailableResponse{
    status: "AVAILABLE";
    match_id: string;
    final_score: number;
    highlights: string[];
}

export interface MatchProcessingResponse{
    status: "PROCESSING";
    match_id: string;
}

export interface MatchFailedResponse{
    status: "FAILED";
    reason: string;
}

export type MatchResponseDTO = MatchAvailableResponse | MatchProcessingResponse | MatchFailedResponse;