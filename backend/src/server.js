const {createApp} = require("./app");

const PORT = process.env.PORT || 3000;


function startServer(){
    const app = createApp();

    app.listen(PORT,()=>{
        console.log(`Skillscore is running on port ${PORT}`)
    })
}


startServer();