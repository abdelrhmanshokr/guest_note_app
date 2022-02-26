const sql = require('mssql');

const databaseConfig = require('../db/dbConfig');

// function to create a new note 
exports.create_new_note = async(req, res) => {
    try{
        return res.status(200).json(req.user);
    }catch(err){
        return res.status(401).json(err.message);
    }
}