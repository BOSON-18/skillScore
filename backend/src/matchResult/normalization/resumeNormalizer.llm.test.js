const { normalizeResumeForRoleLLM } = require("./resumeNormalizer.llm");
const { callLLM } = require("../../llm/llmClient");

jest.mock("../../llm/llmClient");

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

beforeEach(() => {
  jest.clearAllMocks();
});


test("returns normalized resume when LLM output is valid", async () => {
  callLLM.mockResolvedValue(JSON.stringify({
    normalizedSkills: ["react"],
    yearsOfExperience: 2,
    evidence: {
      react: ["React.js"]
    }
  }));

  const result = await normalizeResumeForRoleLLM({
    resumeSnapshot,
    role
  });

  expect(result.normalizedSkills).toEqual(["react"]);
  expect(result.yearsOfExperience).toBe(2);
});


test("rejects LLM output with hallucinated skill", async () => {
  callLLM.mockResolvedValue(JSON.stringify({
    normalizedSkills: ["react", "node"],
    yearsOfExperience: 3
  }));

  await expect(
    normalizeResumeForRoleLLM({
      resumeSnapshot,
      role
    })
  ).rejects.toThrow("validation");
});


test("rejects invalid JSON from LLM", async () => {
  callLLM.mockResolvedValue("not-json");

  await expect(
    normalizeResumeForRoleLLM({
      resumeSnapshot,
      role
    })
  ).rejects.toThrow("invalid JSON");
});
