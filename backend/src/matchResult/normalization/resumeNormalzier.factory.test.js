jest.mock("./resumeNormalizer.llm", () => ({
  normalizeResumeForRoleLLM: jest.fn()
}));

const { normalizeResumeForRole } = require("./resumeNormalizer.factory");
const { normalizeResumeForRoleLLM } = require("./resumeNormalizer.llm");

const role = {
  requiredSkills: [{ name: "react" }]
};

const resumeSnapshot = {
  skills: ["React"],
  yearsOfExperience: 1
};

beforeEach(() => {
  process.env.USE_LLM_NORMALIZER = "true";
});


test("falls back to stub when LLM throws", async () => {
  normalizeResumeForRoleLLM.mockRejectedValue(
    new Error("LLM timeout")
  );

  const result = await normalizeResumeForRole({
    resumeSnapshot,
    role
  });

  expect(result.normalizedSkills).toContain("react");
});
