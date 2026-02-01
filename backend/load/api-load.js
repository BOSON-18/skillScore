import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    million_requests: {
      executor: 'ramping-arrival-rate',
      startRate: 100,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 1000,
      stages: [
        { duration: '2m', target: 500 },    // Warm up: 500 req/s
        { duration: '3m', target: 1000 },   // Ramp to 1K req/s
        { duration: '10m', target: 1000 },  // Hold 1K req/s (600K requests)
        { duration: '3m', target: 1500 },   // Push to 1.5K req/s
        { duration: '5m', target: 1500 },   // Hold 1.5K (450K requests)
        { duration: '2m', target: 0 },      // Cool down
      ],
      // Total: ~1,000,000+ requests in 25 minutes
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],        // Allow up to 5% errors for stress test
    http_req_duration: ['p(95)<500', 'p(99)<2000'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)', 'p(99.9)'],
};

export default function () {
  const payload = JSON.stringify({
    resumeSnapshotId: `resume_${__VU}_${__ITER}_${Date.now()}`,
    jobRoleId: "backend_dev"
  });

  const res = http.post(
    "http://localhost:3000/match-requests",
    payload,
    { 
      headers: { "Content-Type": "application/json" },
      timeout: '10s'
    }
  );

  check(res, {
    "status is 202": r => r.status === 202,
    "response time <1s": r => r.timings.duration < 1000,
    "response time <5s": r => r.timings.duration < 5000,
    "no errors": r => !r.error
  });
}