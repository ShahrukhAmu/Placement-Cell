const express = require('express');
const passport = require('passport');

const router = express.Router();

const userController = require('../controllers/userController');

//---------------Get Request-----------

router.get('/signup', userController.signup);
router.get('/signin', userController.signin);
router.get('/signout' , userController.signout);
router.get('/download-csv' , userController.downloadCsv);

//--------------Post Request-----------

router.post('/create', userController.createUser);

router.post('/create-session', userController.createSession);

module.exports = router;