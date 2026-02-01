const { publishMatchRequest } = require("../kafka/matchRequestProducer");
const express = require("express");


const router = express.Router();

router.post("/",async (req, res) =>{
  const { resumeSnapshotId, jobRoleId } = req.body;

  if (!resumeSnapshotId || !jobRoleId) {
    return res.status(400).json({
      error: "resumeSnapshotId and jobRoleId are required"
    });
  }

  try {
    await publishMatchRequest({ resumeSnapshotId, jobRoleId });
    return res.status(202).json({ status: "ACCEPTED" });
  } catch (err) {
    console.error("[producer] failed to publish", err);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
})

module.exports = router;
