const { body } = require('express-validator/check');

exports.validate = (method) => {
    switch(method){
        case 'user_signup': {
            return [
                body('username', 'Username is required, Please complete required fields').trim().not().isInt().not().isEmpty(),
                body('password', 'Password is required, Please complete required fields').trim().not().isEmpty(),
                body('email', 'Email is required and needs to be unique, Please complete all required fields').trim().not().isInt().not().isEmpty().isEmail()
            ]
        }
    };
};