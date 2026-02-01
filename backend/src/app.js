const express = require("express");
const dotenv = require("dotenv");
const jobRoleController = require("./jobRole/jobRole.controller")
const matchRequestController = require("./matchResult/matchRequest.controller")

function createApp() {


    const app = express();
    app.use(express.json());


    app.get("/health", (req, res) => {
        res.status(200).json({
            status: "ok"
        })
    })
    
    app.use("/job-roles", jobRoleController);
    app.use("/match-requests",matchRequestController)
    return app;

}


module.exports = { createApp }