const sql = require('mssql'); 

const databaseConfig = require('./dbConfig');

// this is repeated with each new request 
// with each new API call in the controller file
async function getdata(){
    try{
        let pool = await sql.connect(databaseConfig);
        // let response = await pool.request().query(\)

        console.log('sql server connected');
    }catch(err){
        console.log('A database connection error occured');
    }
}

module.exports = {
    getdata: getdata
};