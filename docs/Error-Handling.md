# SkillScore — Failure Modes & Error Handling

This document defines how the system behaves when **things break**.

Failure is assumed, not exceptional.

---

## 1. Failure Classification

Failures are categorized to avoid cascading impact.

### Infrastructure Failures

- Database unavailable
- Cache unavailable
- Message broker unavailable

### Data Failures

- Invalid resume snapshot
- Unsupported schema version
- Corrupt normalized data

### Processing Failures

- Worker crash
- Timeout during scoring
- Poison messages

---

## 2. API-Level Behavior

APIs never expose internal failures directly.

### Write APIs

- Acknowledge request acceptance.
- Return processing state.
- Do not block on downstream dependencies.

### Read APIs

- Return last known valid state.
- Never return partial or speculative data.

---

## 3. Database Failures

### Scenario: Primary DB Unavailable

- All write APIs fail fast with explicit error.
- Read APIs return cached data if available.
- No silent degradation.

DB is the final authority; correctness overrides availability.

---

## 4. Cache Failures (Redis)

### Scenario: Cache Unavailable

- APIs fall back to database reads.
- Workers skip cache writes.
- No correctness impact, only latency increase.

Cache is an optimization, never a dependency.

---

## 5. Message Broker Failures (Kafka / Queue)

### Scenario: Broker Unavailable

- APIs still accept requests.
- Async events are retried or buffered.
- Derived data remains stale until recovery.

No synchronous fallback computation is allowed.

---

## 6. Worker Failures

### Crash or Restart

- Messages are re-delivered.
- Idempotent writes prevent duplication.

### Poison Messages

- Routed to a dead-letter queue.
- Logged and monitored.
- Do not block healthy message flow.

---

## 7. Data Validation Failures

- Invalid resume snapshots are rejected at ingest.
- Unsupported schema versions fail explicitly.
- Errors are non-retriable unless input changes.

---

## 8. What the System Never Does

- Never silently drop data.
- Never guess missing inputs.
- Never return partially computed scores.
- Never block APIs waiting for recovery.

---

## 9. User-Visible States

Users observe:

- `PROCESSING`
- `AVAILABLE`
- `FAILED`

Internal retry logic is invisible.