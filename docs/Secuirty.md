# SkillScore — Security & Data Safety

This document defines **how sensitive data is protected**, **who can access what**, and **what the system explicitly avoids**.

Security is designed, not patched.

---

## 1. Data Classification

### Sensitive Data

- Resume snapshots (candidate information)
- Job role details (business data)

### Non-Sensitive Data

- Match scores
- Aggregated metrics
- System logs (PII-free)

---

## 2. Data Handling Principles

- SkillScore never stores raw resume files.
- Resume snapshots are treated as **immutable inputs**.
- No data is mutated in place.
- Derived data can be deleted and recomputed safely.

---

## 3. Access Control

### API Access

- All write APIs require authenticated service-to-service access.
- Read APIs are role-scoped (internal systems vs external consumers).
- No public, unauthenticated endpoints.

### Internal Access

- Workers have least-privilege access.
- Workers cannot modify authoritative requirement data.

---

## 4. PII Protection

- Resume snapshots are stored encrypted at rest.
- No PII is written to logs or metrics.
- Correlation IDs are opaque and non-derivable.

SkillScore assumes upstream services have already handled consent.

---

## 5. Rate Limiting & Abuse Protection

- Write APIs are rate-limited per client.
- Match requests are throttled to prevent scoring abuse.
- Async workers enforce backpressure via queue limits.

---

## 6. Schema & Contract Safety

- Resume snapshot schema is versioned.
- Unsupported schema versions are rejected explicitly.
- No silent schema evolution is allowed.

This prevents upstream drift from corrupting scores.

---

## 7. Secrets & Configuration

- Secrets are never committed to the repository.
- Environment-based configuration only.
- No runtime secret injection via APIs.

---

## 8. Data Retention & Deletion

- Authoritative requirement data retained indefinitely.
- Resume snapshots retained per business policy.
- Derived scores can be purged without data loss.

Deletion is explicit, never implicit.

---

## 9. What the System Does Not Do

- No client-side trust.
- No implicit access escalation.
- No inference on sensitive attributes.
- No ML training on resume data.