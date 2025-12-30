# SkillScore — Observability & Metrics

This document defines **what is measured**, **why it is measured**, and **how system health is proven**.

Metrics exist to explain behavior, not decorate dashboards.

---

## 1. Observability Pillars

SkillScore is observable through:

- **Metrics** (what is happening)
- **Logs** (why it happened)
- **Traces** (where it happened)

All three are required for production credibility.

---

## 2. Core System Metrics

### API Metrics

- Request rate (per endpoint)
- P95 / P99 latency
- Error rate by status code
- Idempotency collision rate

Purpose:

- Detect regressions
- Validate caching effectiveness

---

### Async Pipeline Metrics

- Event lag (publish → consume)
- Worker throughput
- Retry count
- Dead-letter queue size

Purpose:

- Detect backpressure
- Detect silent failures

---

### Scoring Metrics

- Average scoring time
- Score distribution
- Component contribution averages

Purpose:

- Validate scoring logic
- Detect skew or bias

---

## 3. Cache Effectiveness

Tracked explicitly:

- Cache hit ratio
- Cache miss latency
- Invalidation rate

Cache success is measured, not assumed.

---

## 4. Data Quality Metrics

- Invalid resume snapshot rate
- Unsupported schema version rate
- Normalization failure rate

Purpose:

- Detect upstream contract drift

---

## 5. Business Metrics (Resume-Defensible)

These metrics justify resume claims.

- Baseline vs normalized match agreement
- False-positive reduction rate
- Human validation alignment %

This is where the **“40% improvement”** is measured.

---

## 6. Logging Strategy

- Structured logs only
- Correlation IDs propagated across services
- No PII in logs

Logs explain failures, not recreate data.

---

## 7. Tracing Strategy

- Trace spans across:
    - API request
    - Event publish
    - Worker processing
- Slow paths are traceable end-to-end

---

## 8. Alerting Philosophy

Alerts trigger on:

- Sustained error rates
- Processing backlog growth
- Cache anomaly spikes

No alerts on single failures.

---

## 9. What Is Not Measured

- Individual candidate performance
- Per-user behavior
- Any PII-derived metrics