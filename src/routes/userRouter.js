const express = require('express');
const router = express.Router();

const multerUpload = require('../multer/multer_profile_image_config');
const userController = require('../controllers/userController');
const expressValidator = require('../inputValidation/userInputValidation');

router.post('/signup', multerUpload.single('user_profile_picture'), expressValidator.validate('user_signup'), userController.user_signup);
router.post('/login', expressValidator.validate('user_login'), userController.user_login);


module.exports = router;