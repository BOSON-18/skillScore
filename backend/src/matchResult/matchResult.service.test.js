process.env.USE_LLM_NORMALIZER = "false";


jest.mock("./matchResult.repository", () => ({
  claimMatch: jest.fn(),
  markAvailable: jest.fn(),
  markFailed: jest.fn()
}));

jest.mock("./normalization/resumeNormalizer.factory", () => ({
  normalizeResumeForRole: jest.fn()
}));

const {
  claimMatch,
  markAvailable,
  markFailed
} = require("./matchResult.repository");

const {
  normalizeResumeForRole
} = require("./normalization/resumeNormalizer.factory");

const {
  computeAndPersistMatch
} = require("./matchResult.service");

const {
  MatchResultErrorReason
} = require("./matchResult.errors");

describe("MatchResult Service", () => {

  const identity = {
    resumeSnapshotId: "r1",
    jobRoleId: "frontend_dev",
    jobRoleVersion: 1
  };

  const role = {
    requiredSkills: [
      { name: "react", weight: 3 },
      { name: "javascript", weight: 2 }
    ],
    minYearsOfExperience: 1,
    maxYearsOfExperience: 2
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("skips processing if match already claimed", async () => {
    claimMatch.mockResolvedValue(false);

    const result = await computeAndPersistMatch({
      identity,
      role,
      resume: {}
    });

    expect(result.status).toBe("SKIPPED");
    expect(markAvailable).not.toHaveBeenCalled();
    expect(markFailed).not.toHaveBeenCalled();
  });

  test("marks FAILED if candidate is overqualified", async () => {
    claimMatch.mockResolvedValue(true);

    normalizeResumeForRole.mockResolvedValue({
      normalizedSkills: ["react", "javascript"],
      yearsOfExperience: 10
    });

    const result = await computeAndPersistMatch({
      identity,
      role,
      resume: {}
    });

    expect(markFailed).toHaveBeenCalledWith(
      identity,
      MatchResultErrorReason.OVERQUALIFIED
    );

    expect(result.status).toBe("FAILED");
  });

  test("marks AVAILABLE for eligible candidate", async () => {
    claimMatch.mockResolvedValue(true);

    normalizeResumeForRole.mockResolvedValue({
      normalizedSkills: ["react", "javascript"],
      yearsOfExperience: 2
    });

    const result = await computeAndPersistMatch({
      identity,
      role,
      resume: {}
    });

    expect(markAvailable).toHaveBeenCalled();
    expect(result.status).toBe("AVAILABLE");
  });

test("proceeds normally when normalizer returns fallback-safe output", async () => {
  claimMatch.mockResolvedValue(true);

  normalizeResumeForRole.mockResolvedValue({
    normalizedSkills: ["react"],
    yearsOfExperience: 1
  });

  const result = await computeAndPersistMatch({
    identity,
    role,
    resume: {}
  });

  expect(markAvailable).toHaveBeenCalled();
  expect(result.status).toBe("AVAILABLE");
});

});
