# SkillScore — Caching Strategy

This document defines **what is cached, why it is cached, and when it is invalidated**.

Caching exists to protect the system, not to hide bad design.

---

## 1. What Is Cached

### MatchScore (Primary)

- Final computed score between a resume and job role.
- Served directly from cache for read APIs.

### Score Breakdown (Secondary)

- Component-level scoring explanation.
- Cached alongside MatchScore.

No authoritative or normalized data is cached.

---

## 2. Cache Keys

Cache keys are deterministic and version-aware.

```
match:{resume_id}:{job_role_id}:{job_role_version}

```

This guarantees:

- No stale scores after job role updates.
- Safe parallel recomputation.

---

## 3. Cache Write Policy

- Cache is written **only after** successful scoring.
- Workers write to cache, not APIs.
- Cache entries have TTL as a safety net, not correctness mechanism.

---

## 4. Invalidation Rules

Cache is invalidated when:

- Job role version changes.
- Scoring configuration changes.
- Normalized data is regenerated.

Invalidation is event-driven, not time-based.

---

## 5. Cache Miss Behavior

On cache miss:

- API checks persistent MatchScore.
- If absent, emits `MatchRequested`.
- API returns processing state, not partial data.

---

## 6. What Is Explicitly Not Cached

- Raw resumes.
- Normalized resumes.
- Partial or in-progress scores.
- Error states.

---

## 7. Failure Handling

- Cache outages degrade performance, not correctness.
- Database remains the fallback.
- No logic branches rely solely on cache presence.