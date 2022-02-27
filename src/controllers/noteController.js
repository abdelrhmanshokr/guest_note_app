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
        let {note_title, note_content, receiverId, note_type_id} = req.body;
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
            await pool.request().query("INSERT INTO guest_note_schema.notes(note_title, note_content, media_files, senderId, receiverId, note_typeId) VALUES('" + note_title + "','" + note_content  + "','" + filePath + "','" + senderId + "','" + receiverId + "','" + note_type_id + "');");
            // close the connection pool
            await pool.close();
            // TODO push new notification to the receiver as the new note is sent
            return res.status(201).json('Note was send successfully');
        }
        // TODO push new notification to the receiver as the new note is sent
        await pool.request().query("INSERT INTO guest_note_schema.notes(note_title, note_content, sender_id, receiver_id, note_typeId) VALUES('" + note_title + "','" + note_content  + "','" + senderId + "','" + receiverId + "','" + note_type_id + "');");
        // close the connection pool 
        await pool.close();
        
        return res.status(201).json('Note was send successfully');
    }catch(err){
        return res.status(401).json(err.message);
    }
};

exports.soft_delete_a_note = async(req, res) => {
    // a user can only soft delete one of more of their notes 
    // this function switches the stat of a note from soft deleted 1 to not 0
    // and the other way as well 
    try{
        // first validate user input 
        if(validateNoteInput(req)){
            return res.status(422).json(validateNoteInput(req));
        }

        // get the logged user's ID from the check auth middleware
        let userId = req.user._id;
        // get the note's to be soft deleted ID 
        let noteId = req.body.noteId;
        
        // get all logged user's notes 
        let pool = await sql.connect(databaseConfig);
        let note = await pool.request().query("SELECT * FROM guest_note.guest_note_schema.notes WHERE senderId = '" + userId + "' AND note_id = '" + noteId + "';");
        
        // check if this note exists then the logged user is the owner of this note
        // so we can switch its is_soft_deleted status
        if(note.recordset[0]['']){
            // then the note does not belong to this user or it's no longer available
            // in both cases the logged user can't update it 
            return res.status(404).json('Can not access this note, It may have been deleted');
        }

        // other wise the note belongs to the logged user then 
        // we can update its is_soft_deleted status
        let updated_is_soft_deleted = !note.recordset[0].is_soft_deleted;
        await pool.request().query("UPDATE guest_note.guest_note_schema.notes SET is_soft_deleted = '" + updated_is_soft_deleted + "' WHERE senderId = '" + userId + "' AND note_id = '" + noteId + "';");
        await pool.close();

        return res.status(200).json('Note update successfully');
    }catch(err){
        return res.status(401).json(err.message);
    }
};

exports.get_all_user_sent_notes = async(req, res) => {
    try{
        // getting user from the check auth middleware
        let userId = req.user._id;

        // getting all user's sent notes 
        let pool = await sql.connect(databaseConfig);
        let allUsersNotes = await pool.request().query("SELECT * FROM guest_note.guest_note_schema.notes WHERE senderId = '" + userId + "';");
        // close the connection pool
        await pool.close();

        // check if the logged user sent any notes 
        if(!allUsersNotes.recordset[0]){
            return res.status(200).json('It seems you do not have an sent notes yet');
        }

        return res.status(200).json(allUsersNotes);
    }catch(err){
        return res.status(401).json(err.message);
    }
};

exports.get_all_user_received_notes = async(req, res) => {
    try{
        // getting user from the check auth middleware
        let userId = req.user._id;
        let note_type_id = req.body.note_type_id || false;
    
        // getting the date to use as filter to get notes from 30 days 
         
        // getting all user's sent notes 
        let pool = await sql.connect(databaseConfig);
        // check if there's a note type to filter with
        if(note_type_id){
            let allUserReceivedNotes = await pool.request().query("SELECT * FROM guest_note.guest_note_schema.notes WHERE receiverId = '" + userId + "' AND note_typeId = '" + note_type_id + "';");
            // close the connection pool
            await pool.close();

            // check if the logged user sent any notes 
            if(!allUserReceivedNotes.recordset[0]){
                return res.status(200).json('Your inbox is empty !');
            }

            return res.status(200).json(allUserReceivedNotes);
        }
        // other wise filter through all types 
        let allUserReceivedNotes = await pool.request().query("SELECT * FROM guest_note.guest_note_schema.notes WHERE receiverId = '" + userId + "';");
        // close the connection pool
        await pool.close();

        // check if the logged user sent any notes 
        if(!allUserReceivedNotes.recordset[0]){
            return res.status(200).json('Your inbox is empty !');
        }

        return res.status(200).json(allUserReceivedNotes);
    }catch(err){
        return res.status(401).json(err.message);
    }
};