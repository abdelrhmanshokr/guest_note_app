const sql = require('mssql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const databaseConfig = require('../db/dbConfig');
const { database } = require('../db/dbConfig');

// function to validate user input 
function validateUserInput(req){
    let errors = validationResult(req);
    let returnedErrors = errors.array().map(error => error.msg);

    if(!errors.isEmpty()){
        return returnedErrors;
    }
}

exports.user_signup = async(req, res) => {
    try{
        // validate user input
        if(validateUserInput(req)){
            return res.status(422).json(validateUserInput(req));
        }

        // get the user's input
        let {username, email, password} = req.body; 
        let filePath = req.file ? __dirname + req.file.path : false;

        // create a sql connection pool 
        let pool = await sql.connect(databaseConfig);
        // if user exists then return them else return 0, just a step to avoid returning nothing from the sql server query
        let user = await pool.request().query("SELECT ISNULL((SELECT 1 FROM guest_note.guest_note_schema.users WHERE email ='" + email + "'), 0);");
        
        // check if the given email is used or not because it needs to be unique
        if(!user.recordset[0]['']){
            // then this email wasn't used before so the user can use it
            let hashedPassword = await bcrypt.hash(password, 10);
            // add the new user with their hashed password to the database 
            if(filePath){
                await pool.request().query("INSERT INTO guest_note_schema.users(username, email, user_password, user_profile_picture) VALUES('" + username + "','" +  email + "','" + hashedPassword + "','" + filePath + "' );");
                // close the connection pool
                await pool.close();

                return res.status(201).json('User created successfully');
            }
            await pool.request().query("INSERT INTO guest_note_schema.users(username, email, user_password) VALUES('" + username + "','" +  email + "','" + hashedPassword + "' );");
            // close the connection pool 
            await pool.close();

            return res.status(201).json('User created successfully');
        }

        return res.status(400).json('This email is already in use please try with another one');
    }catch(err){
        return res.status(401).json(err.message);
    }    
};

exports.user_login = async(req, res) => {
    try{
        // validate user input
        if(validateUserInput(req)){
            return res.status(422).json(validateUserInput(req));
        }

        // get the user input
        let {email, password} = req.body;
        // create a sql connection pool 
        let pool = await sql.connect(databaseConfig);
        // get the user from the database using their email
        let user = await pool.request().query("SELECT ISNULL((SELECT 1 FROM guest_note.guest_note_schema.users WHERE email ='" + email + "'), 0);");
        let userData = await pool.request().query("SELECT user_id, username, email, user_password FROM guest_note.guest_note_schema.users WHERE email ='" + email + "';");
        // close the connection pool 
        await pool.close();

        // check if this user exists
        if(user.recordset[0]['']){
            // then the user is in the system
            let {username, user_id, email, user_password} = userData.recordset[0];
            // first compare their password with the hashed password in the system
            let isPasswordValid = await bcrypt.compare(password, user_password);
            // TODO replace the error message to Login failed !
            if(!isPasswordValid) throw new Error('Login failed password is not correct');

            // if password is valid then create a token for the user 
            let token = jwt.sign(
                {
                    username: username,
                    email: email,
                    _id: user_id
                },
                process.env.LOGIN_JWT_TOKEN_SECRET,
                {
                    expiresIn: '24h' // token expiration period
                }
            );

            // finally return that token 
            return res.status(200).json({token});
        }

        // finally if user doesn't exist in the system
        return res.status(404).json('User does not exist, Please check your email or password');
    }catch(err){
        return res.status(500).json(err.message);
    }
};

exports.switch_daily_notification = async(req, res) => {
    // get the logged user from the check auth middleware
    let userId = req.user._id;

    let pool = await sql.connect(databaseConfig);
    let user = await pool.request().query("SELECT * FROM guest_note.guest_note_schema.users WHERE user_id = '" + userId + "';");
    let updated_daily_notification = !user.recordset[0].daily_notify_me
    
    // update the daily_notify_me flag 
    await pool.request().query("UPDATE guest_note.guest_note_schema.users SET daily_notify_me = '" + updated_daily_notification + "' WHERE user_id = '" + userId + "';");
    await pool.close();

    return res.status(200).json('User updated successfully');
};

// this function purpose is to notify all active users 
// with their new messages on a daily basis 
exports.daily_user_notifications = async(req, res) => {
    let pool = await sql.connect(databaseConfig);
    let usersAndNotes = await pool.request().query(`
        SELECT u.email AS receiver, COUNT(*) AS total_number_of_notes, nt.note_type_name
        FROM guest_note.guest_note_schema.users AS u
        JOIN guest_note.guest_note_schema.notes AS n  
        ON u.user_id = n.receiverId
        JOIN guest_note.guest_note_schema.note_types AS nt
        ON n.note_typeId = nt.note_type_id
        WHERE 
        u.daily_notify_me = 1 AND 
        n.is_soft_deleted = 0 AND
        n.created_at >= GETDATE() - 1
        GROUP BY u.email, nt.note_type_name;    
    `);
    // close the connection pool 
    await pool.close();

    // you can check out the output it's exactly what we're looking for 
    // here should be the logic to send each user their new notification
    // it could be done by a service like mailgun or any free service  
    console.log(usersAndNotes.recordset);
}