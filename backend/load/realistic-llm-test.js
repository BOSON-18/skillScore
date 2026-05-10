import http from "k6/http";
import { check, sleep } from "k6";

// Test data - all combinations
const resumeIds = [
  // Frontend (5)
  "frontend_senior_001", "frontend_mid_001", "frontend_junior_001", 
  "frontend_fullstack_001", "frontend_specialist_001",
  // Backend (5)
  "backend_senior_001", "backend_mid_001", "backend_junior_001",
  "backend_architect_001", "backend_specialist_001",
  // DevOps (5)
  "devops_senior_001", "devops_mid_001", "devops_junior_001",
  "devops_sre_001", "devops_cloud_001",
  // Data Science (5)
  "datascience_senior_001", "datascience_mid_001", "datascience_junior_001",
  "datascience_ml_001", "datascience_analyst_001",
  // Mobile (5)
  "mobile_senior_001", "mobile_mid_001", "mobile_junior_001",
  "mobile_ios_001", "mobile_android_001"
];

const jobRoleIds = [
  "frontend_dev",
  "backend_dev",
  "devops_engineer",
  "data_scientist",
  "mobile_dev"
];

export const options = {
  scenarios: {
    realistic_load: {
      executor: 'constant-arrival-rate',
      duration: '1m',
      rate: 30, // 30 req/min (to stay under Groq's 30/min limit)
      timeUnit: '1m',
      preAllocatedVUs: 10,
      maxVUs: 50,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'], // <5% errors
    http_req_duration: ['p(95)<50'], // API should still be fast
  },
};

export default function () {
  // Pick random resume and job role
  const resumeId = resumeIds[Math.floor(Math.random() * resumeIds.length)];
  const jobRoleId = jobRoleIds[Math.floor(Math.random() * jobRoleIds.length)];

  const payload = JSON.stringify({
    resumeSnapshotId: resumeId,
    jobRoleId: jobRoleId
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
    "response time <50ms": r => r.timings.duration < 50,
  });

  // Small delay to avoid hammering
  sleep(0.5);
}