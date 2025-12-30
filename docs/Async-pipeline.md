# SkillScore — Asynchronous Pipeline

This document defines **when and why asynchronous processing exists** in the system.

---

## 1. Why Async Exists (Non-Negotiable)

Asynchronous processing is used because:

- Resume parsing and scoring are CPU / IO heavy.
- Match computation is non-critical-path for user requests.
- Retries, backpressure, and recomputation must not affect APIs.

Synchronous APIs are for **coordination**.

Workers are for **computation**.

---

## 2. Event Types

### ResumeUploaded

**Emitted when:** Resume is successfully stored

**Consumed by:** Resume Normalization Worker

---

### JobRoleCreated / JobRoleUpdated

**Emitted when:** Job role is created or versioned

**Consumed by:** Job Role Normalization Worker

---

### MatchRequested

**Emitted when:** Match API is called and no valid score exists

**Consumed by:** Scoring Worker

---

### DerivedDataInvalidated

**Emitted when:** Job role is updated

**Consumed by:** Scoring Worker (recompute affected matches)

---

## 3. Worker Responsibilities

### Normalization Workers

- Consume upload/create events.
- Produce normalized representations.
- Never write to authoritative entities.

### Scoring Worker

- Consumes `MatchRequested`.
- Fetches normalized inputs.
- Computes deterministic score.
- Persists `MatchScore`.
- Publishes completion event.

---

## 4. Failure & Retry Model

- Workers are **at-least-once**.
- All operations are **idempotent**.
- Duplicate events must not create duplicate derived records.
- Poison messages are isolated, not retried infinitely.

---

## 5. Data Consistency Model

- Eventual consistency is accepted.
- APIs reflect **processing state**, not promises.
- Cached results are invalidated on derived data changes.

---

## 6. What Async Never Does

- No API response depends on worker completion.
- No worker mutates authoritative data.
- No synchronous fallback to heavy computation.