const sql = require('mssql');
require('dotenv').config();

const databaseConfig = require('./dbConfig');

const dbConnect = function (databaseConfig){
    sql.connect(databaseConfig, (err) => {
        if(err) console.log(`Database connection error ${err.message}`);

        console.log('app connection to sql database');
    });
};

module.exports = dbConnect;