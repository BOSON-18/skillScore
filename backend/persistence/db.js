const {Pool} = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});


// DB Error Wrapper

class DBError extends Error {
    constructor(message,code,cause){
        super(message);
        this.name = "DBError";
        this.code = code;
        this.cause = cause;
    }
}

async function query(text,params=[]){
    try{
        return await pool.query(text,params);
    }catch(error){
        // logging Error for now
        console.error("Database Query Error:",error);
        throw new DBError(
            "Databse operation failed",
            error.code,
            error
        )
    }
}


module.exports = {
    query,
    DBError
};