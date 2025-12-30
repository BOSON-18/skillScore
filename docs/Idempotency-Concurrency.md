## 1. Idempotency Principles

- Every write operation must be safely repeatable.
- Duplicate requests must not create duplicate side effects.
- Idempotency is enforced at **data layer**, not in memory.

---

## 2. API Idempotency

### Resume Snapshot Ingest

**Key:** `external_resume_id + schema_version`

Rule:

- If the same snapshot is ingested again, it is ignored.
- No new derived computation unless version changes.

---

### Match Request

**Key:** `(resume_snapshot_id, job_role_id, job_role_version)`

Rule:

- Same request returns the same `match_id`.
- No duplicate MatchScore rows.

---

## 3. Worker Idempotency

Workers operate under **at-least-once delivery**.

Rules:

- Every derived write uses a **natural uniqueness constraint**.
- If a duplicate event is consumed, the write becomes a no-op.
- No worker relies on in-memory state for correctness.

---

## 4. Exactly-Once Illusion

The system provides *effectively-once* behavior by combining:

- At-least-once messaging
- Idempotent writes
- Deterministic computation

No distributed transactions are used.

---

## 5. Consistency Model

- Strong consistency for authoritative data.
- Eventual consistency for derived data.
- APIs expose **state**, not guarantees.

Users see:

- `PROCESSING`
- `AVAILABLE`
- `FAILED`

Never partial results.

---

## 6. Race Conditions (Handled Explicitly)

- Concurrent match requests → single MatchScore row.
- JobRole update during scoring → score invalidated post-write.
- Cache population races → last write wins (safe).

---

## 7. What Is Not Guaranteed

- Ordering of async events.
- Immediate visibility of derived results.
- Zero duplicate event delivery.

The system is designed to remain correct despite this.