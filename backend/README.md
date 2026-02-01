## SkillScore – JobRole Service

SkillScore is an asynchronous, scalable resume–job matching system designed with correctness, idempotency, and historical accuracy as first-class concerns.

Key Characteristics

Asynchronous processing using Kafka

Deterministic, reproducible match results

Versioned and immutable job roles

Database-enforced idempotency

Optional, bounded LLM usage for resume normalization

Horizontally scalable workers

Safe under retries and failures

High-Level Architecture
Client
  ↓
HTTP API (Producer)
  ↓
Kafka (match-requests)
  ↓
Worker (Consumer)
  ↓
Postgres (Source of Truth)


Kafka handles delivery and buffering.
Postgres enforces correctness and uniqueness.

Core Concepts
Job Roles

Owned by SkillScore

Immutable and versioned

Any update creates a new version

Resume Snapshots

Provided by an upstream service

Treated as read-only input

Match Identity

Each match is uniquely identified by:

(resumeSnapshotId, jobRoleId, jobRoleVersion)


This guarantees idempotency, safe retries, and historical correctness.

Match Lifecycle

PROCESSING — retryable

AVAILABLE — terminal success

FAILED — terminal business failure

No retry counters.
No extra states.

LLM Usage

LLMs are used only for resume normalization:

Normalize noisy resume data into role-specific skills

Output strictly validated against schema

Skills constrained to job role ontology

Any failure triggers deterministic fallback

LLMs never score or decide eligibility.

Failure Handling

At-least-once Kafka delivery

Duplicate messages are safe

Worker crashes leave retryable state

Database enforces uniqueness

The system was validated under sustained high load with over a million asynchronous requests and zero duplicate matches.

Scaling Model

Scale by adding worker replicas

No shared memory

No coordination services

No code changes required

Status

SkillScore v1 is complete from a correctness standpoint.
Further work (LLM enhancements, retries, batching, metrics) is incremental hardening, not foundational change.

### Local setup
- Run Postgres via Docker
- Create `.env`
- Run migrations
- Start server

### JobRole guarantees
- Versioned, immutable roles
- Idempotent updates
- Semantic versioning via normalization


### at-most-once delivery

means that for each message handed to the mechanism, that message is delivered zero or one times; in more casual terms it means that messages may be lost.

### at-least-once delivery

means that for each message handed to the mechanism potentially multiple attempts are made at delivering it, such that at least one succeeds; again, in more casual terms this means that messages may be duplicated but not lost.

### exactly-once delivery

means that for each message handed to the mechanism exactly one delivery is made to the recipient; the message can neither be lost nor duplicated.



### KAFKA IT IS

Message contract
Topic -> match-requests
-> key === resume_snapshot_id
-> payload resume id and job role id


Candidate applies
-> Validate input , Publish kafka message, return immediately
-> no db ops or waiting 
-> At least once delivery is guarantee
    (Duplicates messages are expected and harmless)

1. Consume message
2. Fetch latest version
3. Build identity
4. Claim
5. Fetch resume snapshot -> validate and normalize if needed
6. Calculate score and give explanation
7. Store result

Kafka will retyrn on its own -> Timebased

For each message:

Resolve latest job role version

Build match identity

claimMatch(identity)

If not claimed → ACK + exit

Fetch resume snapshot

Normalize (stub / LLM later)

Score + explain

Persist result

ACK message

If the worker crashes:

Kafka redelivers

DB uniqueness + claim makes it safe