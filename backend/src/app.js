const express = require("express");
const dotenv = require("dotenv");
const jobRoleController = require("./jobRole/jobRole.controller")

function createApp() {


    const app = express();
    app.use(express.json());


    app.get("/health", (req, res) => {
        res.status(200).json({
            status: "ok"
        })
    })
    
    app.use("/job-roles", jobRoleController)
    return app;

}


module.exports = { createApp }