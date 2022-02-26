const { body } = require('express-validator');

exports.validate = (method) => {
    switch(method){
        case 'send_new_note': {
            return [
                body('note_title', 'Note title is required, Please complete required fields').trim().not().isInt().not().isEmpty(),
                body('note_content', 'Note content is required, Please complete required fields').trim().not().isEmpty(),
                body('receiverId', 'receiver Id is required, Please complete all required fields').trim().not().isEmpty()
            ]
        }
    };
};