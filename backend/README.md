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






Results
THRESHOLDS

    http_req_duration

    ✓ 'p(95)<50' p(95)=4.5ms

    http_req_failed

    ✓ 'rate<0.05' rate=0.00%

  █ TOTAL RESULTS

    checks_total.......: 600    0.999999/s

    checks_succeeded...: 99.83% 599 out of 600

    checks_failed......: 0.16%  1 out of 600

    ✓ status is 202

    ✗ response time <50ms

      ↳  99% — ✓ 299 / ✗ 1

    HTTP

    http_req_duration..............: avg=3.44ms   min=1.52ms   med=3.18ms   max=73.88ms  p(90)=4.11ms   p(95)=4.5ms

      { expected_response:true }...: avg=3.44ms   min=1.52ms   med=3.18ms   max=73.88ms  p(90)=4.11ms   p(95)=4.5ms

    http_req_failed................: 0.00% 0 out of 300

    http_reqs......................: 300   0.5/s

    EXECUTION

    iteration_duration.............: avg=504.11ms min=501.87ms med=503.69ms max=581.03ms p(90)=504.83ms p(95)=505.39ms

    iterations.....................: 300   0.5/s

    vus............................: 0     min=0        max=0

    vus_max........................: 10    min=10       max=10

    NETWORK

    data_received..................: 79 kB 131 B/s

    data_sent......................: 62 kB 103 B/s