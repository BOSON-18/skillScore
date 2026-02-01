const express = require("express");
const { createNewJobRoleVersion,getLatestJobRole,getJobRoleByVersion } = require("./jobRole.service");
const { InvalidJobRoleInputError, JobRoleNotFoundError } = require("./jobROle.errors");
const { getAllJobRoles } = require("./jobRole.repository");



const router = express.Router();



// create or update a job ROle
// Craetes a new version only if defination changed
// TESTED
router.get("/", async(req,res)=>{
    try{

        const job_roles = await getAllJobRoles();

        return res.status(200).json({job_roles});
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:error.message
        })
    }
})
// TESTED
router.post("/", async (req, res) => {
    try {

        const { jobRoleId, title, minYearsOfExperience,maxYearsOfExperience,requiredSkills  } = req.body;
        console.log("Checking YOE in controller ",minYearsOfExperience)

        const jobRole = await createNewJobRoleVersion({
            jobRoleId, title,minYearsOfExperience,maxYearsOfExperience, requiredSkills
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
            error: "INTERNAL_SERVER_ERROR",
            detail: err
        })
    }
})


// Get latest job Role by version
// TESTED
router.get("/:jobRoleId/latest", async (req, res) => {
    try {
        const { jobRoleId } = req.params;
        console.log(jobRoleId)
        const jobRole = await getLatestJobRole(jobRoleId);

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

// TESTED
router.get("/:jobRoleId/versions/:version", async (req, res) => {

    try {

        const { jobRoleId, version } = req.params;
        const parsedVersion = Number(version);
        console.log(req.params)
        const jobRole = await getJobRoleByVersion(jobRoleId, parsedVersion);
        console.log("Checking job role",jobRole)
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