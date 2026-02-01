const { calculateScore } = require("./scoreCalculator");

describe("Score Calculator – eligibility and scoring", () => {

  const baseRole = {
    requiredSkills: [
      { name: "react", weight: 3 },
      { name: "javascript", weight: 2 }
    ],
    minYearsOfExperience: 1,
    maxYearsOfExperience: 2
  };

  test("fresher allowed for 1 YOE role", () => {
    const result = calculateScore({
      role: baseRole,
      resume: {
        normalizedSkills: ["react", "javascript"],
        yearsOfExperience: 0
      }
    });

    expect(result.eligible).toBe(true);
    expect(result.score).toBeGreaterThan(60);
  });

  test("ideal candidate not rejected", () => {
    const result = calculateScore({
      role: baseRole,
      resume: {
        normalizedSkills: ["react", "javascript"],
        yearsOfExperience: 2
      }
    });

    expect(result.eligible).toBe(true);
  });

  test("overqualified candidate is rejected", () => {
    const result = calculateScore({
      role: baseRole,
      resume: {
        normalizedSkills: ["react", "javascript"],
        yearsOfExperience: 10
      }
    });

    expect(result.eligible).toBe(false);
    expect(result.reason).toBe("OVERQUALIFIED");
  });

  test("no maxYearsOfExperience never rejects", () => {
    const role = {
      ...baseRole,
      maxYearsOfExperience: undefined
    };

    const result = calculateScore({
      role,
      resume: {
        normalizedSkills: ["react"],
        yearsOfExperience: 15
      }
    });

    expect(result.eligible).toBe(true);
  });

});
