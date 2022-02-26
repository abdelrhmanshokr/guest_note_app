const sql = require('mssql');
const { validationResult } = require('express-validator');

const databaseConfig = require('../db/dbConfig');

// function to validate user's input 
function validateNoteInput(req){
    let errors = validationResult(req);
    let returnedErrors = errors.array().map(error => error.msg);

    if(!errors.isEmpty()){
        return returnedErrors;
    }
}

exports.send_new_note = async(req, res) => {
    try{
        // validate note input
        if(validateNoteInput(req)){
            return res.status(422).json(validateNoteInput(req));
        }

        // get the senderId from the checkAuth middleware
        let senderId = req.user._id;
        // get the user's input
        // for the receiverId the user should be prompted by all active users' Ids and 
        // then they would choose one or some users to send their note to but 
        // for now the receiverId is gonna be used as an input to make it easier  
        let {note_title, note_content, receiverId} = req.body;
        // get the media file attached to the note
        let filePath = req.file ? __dirname + req.file.path : false;

        // first check if the receiverId is valid 
        let pool = await sql.connect(databaseConfig);
        let allUsersIds = await pool.request().query("SELECT user_id from guest_note.guest_note_schema.users");
        let allIds = allUsersIds.recordset.map(userId => userId.user_id);
        if(allIds.indexOf(+receiverId) === -1){
            // then the receiver doesn't exist 
            return res.status(404).json('Receiver not found');
        }

        // then receiver exists 
        // so we can create this new user
        if(filePath){
            await pool.request().query("INSERT INTO guest_note_schema.notes(note_title, note_content, media_files, senderId, receiverId) VALUES('" + note_title + "','" + note_content  + "','" + filePath + "','" + senderId + "','" + receiverId + "' );");
            // close the connection pool
            await pool.close();

            return res.status(201).json('Note was send successfully');
        }
        await pool.request().query("INSERT INTO guest_note_schema.notes(note_title, note_content, sender_id, receiver_id) VALUES('" + note_title + "','" + note_content  + "','" + senderId + "','" + receiverId + "' );");
        // close the connection pool 
        await pool.close();
        
        return res.status(201).json('Note was send successfully');
    }catch(err){
        return res.status(401).json(err.message);
    }
}