const { body } = require('express-validator');

exports.validate = (method) => {
    switch(method){
        case 'send_new_note': {
            return [
                body('note_title', 'Note title is required, Please complete required fields').trim().not().isInt().not().isEmpty(),
                body('note_content', 'Note content is required, Please complete required fields').trim().not().isEmpty(),
                body('receiverId', 'receiver Id is required, Please complete all required fields').trim().not().isEmpty(),
                body('note_type_id', 'Note type is required, Please complete all required fileds').trim().not().isEmpty().isInt()
            ]
        }
        case 'soft_delete_a_note': {
            return [
                body('noteId', 'Note Id is required, Please complete all required fields').trim().isInt().not().isEmpty()
            ]
        }
    };
};