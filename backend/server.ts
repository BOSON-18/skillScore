import express from "express";
import dotenv from "dotenv";
import { createJobRoleController, updateJobRoleController } from "./controller/jobRole.controller";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

app.post("/job-roles", createJobRoleController);
app.put("/job-roles/:job_role_id", updateJobRoleController);

// MUST be last
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SkillScore API running on port ${PORT}`);
});
