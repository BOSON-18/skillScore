const express = require("express");
const { createNewJobRoleVersion } = require("./jobRole.service");
const { InvalidJobRoleInputError, JobRoleNotFoundError } = require("./jobROle.errors");
const { getJobRoleByVersion } = require("./jobRole.repository");



const router = express.Router();



// create or update a job ROle
// Craetes a new version only if defination changed

router.post("/", async (req, res) => {
    try {

        const { jobRoleId, title, requiredSkills } = req.body;

        const jobRole = await createNewJobRoleVersion({
            jobRoleId, title, requiredSkills
        });
        return res.status(201).json(jobRole);

    } catch (err) {

        if (err instanceof InvalidJobRoleInputError) {

            return res.status(400).json({
                error: "INVALID_JOB_ROLE_INPUT",
                message: err.message
            })
        }
        console.error("Create job role failed, ", err.message);

        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR"
        })
    }
})


// Get latest job Role by version

router.get("/:jobRoleId/latest", async (req, res) => {
    try {
        const { jonRoleId } = req.params;

        const jobRole = await getLatestJobRole(jsonRoleId);

        return res.status(200).json(jobRole);
    } catch (err) {
        if (err instanceof JobRoleNotFoundError) {

            return res.status(404).json({
                error: "JOB_ROLE_NOT_FOUND",
                message: err.message
            })
        }

        if (err instanceof InvalidJobRoleInputError) {
            return res.status(400).json({
                error: "INVALID_JOB_ROLE_INPUT",
                message: err.message
            })
        }

        console.error("Fetch latest job role failed ", err.message);

        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR"
        })
    }
})


// Get a specific job role version


router.get("/:jobRoleId/versions/:version", async (req, res) => {

    try {

        const { jobRoleId, version } = req.params;
        const parsedVersion = Number(version);

        const jobRole = await getJobRoleByVersion(jobRoleId, parsedVersion);

        return res.status(201).json(jobRole);



    } catch (err) {
        if (err instanceof JobRoleNotFoundError) {
            return res.status(404).json({
                error: "JOB_ROLE_NOT_FOUND",
                message: err.message
            })
        }

        if (err instanceof InvalidJobRoleInputError) {
            return res.status(400).json({
                error: "INVALID_JOB_ROLE_INPUT",
                message: err.message
            })
        }

        console.error("Fetch job role version failed", err);

        return res.status(500).json({
            error: "INTERNAL_SERVER_ERROR"
        })
    }
})


module.exports = router;