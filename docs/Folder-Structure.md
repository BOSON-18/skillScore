Create `docs/repo-structure.md`.

Paste the following content as-is.

---

# SkillScore — Repository & Service Structure

This document defines **how the codebase is organized** and **why those boundaries exist**.

Structure enforces discipline.

Bad structure creates coupling that no refactor fully fixes.

---

## 1. High-Level Repo Layout

```
skillscore/
│
├── docs/# All design decisions (already written)
│
├── backend/
│   ├── api/# Synchronous HTTP APIs
│   ├── workers/# Asynchronous processors
│   ├── domain/# Core business logic
│   ├── persistence/# DB models, repositories
│   ├── messaging/# Event producers/consumers
│   ├── cache/# Redis access & policies
│   ├── config/# Environment-based configuration
│   └── common/# Shared utilities (pure, stateless)
│
├── migrations/# DB schema migrations
│
├── scripts/# One-off operational scripts
│
├── docker/# Dockerfiles & compose configs
│
└── README.md

```

---

## 2. Service Boundary Rules

### API Layer

- Handles HTTP only.
- No business logic.
- No scoring logic.
- Emits events, never computes.

---

### Workers

- Consume events.
- Perform normalization and scoring.
- Write derived data.
- Populate cache.

Workers never expose HTTP endpoints.

---

### Domain Layer

- Scoring model
- Weighting logic
- Validation rules

Pure logic only.

No DB, no cache, no Kafka imports.

---

### Persistence Layer

- Table mappings
- Queries
- Index-aware access

No scoring logic here.

---

### Messaging Layer

- Event definitions
- Producers
- Consumers

Events are contracts, not implementation details.

---

## 3. Dependency Direction (Strict)

```
API ──▶Domain
API ──▶ Messaging

Workers ──▶Domain
Workers ──▶ Persistence
Workers ──▶Cache
Workers ──▶ Messaging

Domain ──▶ nothing

```

Violations are architectural bugs.

---

## 4. What Is Explicitly Forbidden

- Domain importing persistence
- API calling scoring logic directly
- Workers mutating authoritative requirements
- Shared “utils” that hide business logic

---

## 5. Why This Structure Exists

- Async and sync paths are physically separated
- Business logic is testable in isolation
- Infrastructure can be replaced without rewriting logic
- Interviewers can navigate the repo in minutes

---