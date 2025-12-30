SkillScore — API Contracts (v1)

This document defines public-facing synchronous APIs only.
No worker endpoints. No internal shortcuts.

1. Resume APIs
POST /api/v1/resumes

Purpose: Ingest a resume as authoritative data.

Request

Resume file or raw text

Candidate identifier

Guarantees

Resume is stored immutably.

Returns a resume_id.

Triggers async normalization.

Non-Guarantees

No parsing or scoring in this request.

GET /api/v1/resumes/{resume_id}

Purpose: Fetch resume metadata and processing status.

Returns

Resume ID

Status: UPLOADED | NORMALIZED | FAILED

2. Job Role APIs
POST /api/v1/job-roles

Purpose: Create a canonical job role.

Request

Job title

Description

Optional metadata

Guarantees

Versioned on future updates.

Triggers async normalization.

PUT /api/v1/job-roles/{job_role_id}

Purpose: Update job role definition.

Guarantees

Creates a new version.

Invalidates related derived scores.

3. Match APIs
POST /api/v1/matches

Purpose: Request scoring between a resume and job role.

Request

resume_id

job_role_id

Guarantees

Idempotent for same inputs.

Triggers async scoring if not present.

Returns

match_id

Current status

GET /api/v1/matches/{match_id}

Purpose: Fetch match result.

Returns

Score breakdown

Final match percentage

Cached if available

4. API Design Rules

All APIs are stateless.

All heavy work is async.

Read APIs never trigger recomputation.

Write APIs never block on workers.