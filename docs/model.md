1. Authoritative Entities

    These entities represent source-of-truth data. They are created explicitly and never inferred.

    Resume

    Raw resume uploaded by a candidate.

    Stored once, referenced everywhere.

    Never modified after ingestion.

    JobRole

    Canonical representation of a job description.

    Owned by the system or recruiter input.

    Versioned on change.

    Candidate

    Logical owner of one or more resumes.

    Metadata only; no scoring logic tied here.

2. Derived Entities

    These entities are computed outputs and can be regenerated.

    NormalizedResume

    Structured form derived from Resume.

    Extracted skills, experience, keywords.

    Regenerable from Resume at any time.

    NormalizedJobRole

    Structured form derived from JobRole.

    Canonical skill and requirement mapping.

    MatchScore

    Output of scoring logic between a resume and a job role.

    Fully derived.

    Safe to delete and recompute.

3. Immutable vs Mutable Data
    Immutable

    Resume (raw)

    NormalizedResume (for a given version)

    MatchScore (for a given input pair)

    Mutable

    JobRole (versioned)

    Candidate metadata

    Scoring configuration (weights, thresholds)

    Immutability is enforced to preserve auditability and explainability.

4. Entity Lifecycle
    Resume

    Upload → Store (immutable) → Normalize (async) → Ready for scoring

    JobRole

    Create → Normalize → Version on update → Trigger re-scoring

    MatchScore

    Trigger → Compute (async) → Persist → Cache → Serve

    Deletion of derived entities never affects authoritative data.

5. Ownership Boundaries
    Synchronous (API-owned)

    Resume upload

    Job role creation

    Fetching existing match scores

    Asynchronous (Worker-owned)

    Resume normalization

    Job role normalization

    Scoring computation

    Re-scoring on updates

    APIs never perform heavy computation.
    Workers never mutate authoritative entities.