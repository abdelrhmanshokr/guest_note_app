const express = require('express');
const router = express.Router();

const noteController = require('../controllers/noteController');
const checkAuth = require('../middlewares/checkAuth');

router.post('/', checkAuth, noteController.create_new_note);

module.exports = router;