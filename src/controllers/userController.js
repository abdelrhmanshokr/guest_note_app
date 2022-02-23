const sql = require('mssql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator/check');

const databaseConfig = require('../db/dbConfig');

exports.user_signup = async(req, res) => {
    try{
        // validate user input 
        let errors = validationResult(req);
        let returnedErrors = [];
        console.log(errors);
        if(!errors.isEmpty()){
            for(error of errors.array()){
                returnedErrors.push(error.msg);
            }
            
            return res.status(422).json(returnedErrors);
        }

        // get the user's input
        let {username, email, password} = req.body;
        // create a sql connection pool 
        let pool = await sql.connect(databaseConfig);
        let user = await pool.request().query("SELECT ISNULL((SELECT 1 FROM guest_note.guest_note_schema.users WHERE email ='" + email + "'), 0);");
        
        // check if the given email is used or not because it needs to be unique
        if(!user.recordset[0]['']){
            console.log('this is password', password);
            let hashedPassword = await bcrypt.hash(password, 10);
            // add the new user with their hashed password to the database 
            await pool.request().query("INSERT INTO guest_note_schema.users(username, email, user_password) VALUES('" + username + "','" +  email + "','" + hashedPassword + "' );");

            return res.status(201).json('User created successfully');
        }

        return res.status(400).json('This email is already in use please try with another one');
    }catch(err){
        return res.status(401).json(err.message);
    }    
};