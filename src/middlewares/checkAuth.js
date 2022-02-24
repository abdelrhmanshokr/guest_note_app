const jwt = require('jsonwebtoken');
const sql = require('mssql');

const databaseConfig = require('../db/dbConfig');

module.exports = async(req, res, next) => {
    try{
        const token = req.headers.authorization.replace('Bearer ', '');
        const decodedToken = jwt.verify(token, process.env.LOGIN_JWT_TOKEN_SECRET);
        const pool = await sql.connect(databaseConfig);
        // check if the user exist or not 
        let user = await pool.request().query("SELECT ISNULL((SELECT 1 FROM guest_note.guest_note_schema.users WHERE user_id ='" + decodedToken._id + "'), 0);");
        let userData = await pool.request().query("SELECT user_id, username, email, user_password FROM guest_note.guest_note_schema.users WHERE email ='" + email + "';");
        // close the connection pool 
        pool.close();

        if(!user.recordset[0]['']){
            // then no such user was found
            throw new Error('Unauthorized access');
        }

        req.user = userData;
        next();
    }catch(err){
        res.status(401).json('Unauthorized access');
    }
};