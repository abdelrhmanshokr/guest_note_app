const express = require('express');
const router = express.Router();

const noteController = require('../controllers/noteController');
const checkAuth = require('../middlewares/checkAuth');
const multerUpload = require('../multer/multer_note_media_file_config');
const expressValidator = require('../inputValidation/noteInputValidation');

router.post('/', checkAuth, multerUpload.single('media_files'), expressValidator.validate('send_new_note'), noteController.send_new_note);

module.exports = router;