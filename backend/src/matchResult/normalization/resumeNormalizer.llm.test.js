const { normalizeResumeForRoleLLM } = require("./resumeNormalizer.llm");

const role = {
  requiredSkills: [
    { name: "react" },
    { name: "javascript" }
  ]
};

const resumeSnapshot = {
  skills: ["React.js", "Node"],
  experience: 2
};


test("returns normalized resume when LLM output is valid", async () => {
  const callLLM = jest.fn().mockResolvedValue(JSON.stringify({
    normalizedSkills: ["react"],
    yearsOfExperience: 2,
    evidence: {
      react: ["React.js"]
    }
  }));

  const result = await normalizeResumeForRoleLLM({
    resumeSnapshot,
    role,
    callLLM
  });

  expect(result.normalizedSkills).toEqual(["react"]);
  expect(result.yearsOfExperience).toBe(2);
});


test("rejects LLM output with hallucinated skill", async () => {
  const callLLM = jest.fn().mockResolvedValue(JSON.stringify({
    normalizedSkills: ["react", "node"],
    yearsOfExperience: 3
  }));

  await expect(
    normalizeResumeForRoleLLM({
      resumeSnapshot,
      role,
      callLLM
    })
  ).rejects.toThrow("validation");
});


test("rejects invalid JSON from LLM", async () => {
  const callLLM = jest.fn().mockResolvedValue("not-json");

  await expect(
    normalizeResumeForRoleLLM({
      resumeSnapshot,
      role,
      callLLM
    })
  ).rejects.toThrow("invalid JSON");
});

test("throws if callLLM is missing", async () => {
  await expect(
    normalizeResumeForRoleLLM({
      resumeSnapshot,
      role
    })
  ).rejects.toThrow("callLLM");
});
