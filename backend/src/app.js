const express = require("express");
const dotenv = require("dotenv");


function createApp() {


    const app = express();
    app.use(express.json());

    app.get("/health", (req, res) => {
        res.status(200).json({
            status: "ok"
        })
    })

    return app;

}


module.exports = {createApp}