const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const expressValidator = require('../inputValidation/userInputValidation');

router.post('/signup', expressValidator.validate('user_signup'), userController.user_signup);


module.exports = router;