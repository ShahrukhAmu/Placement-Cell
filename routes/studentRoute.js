const express = require('express');
const passport = require('passport');

const router = express.Router();

const studentController = require('../controllers/studentController');

//--------------Get Requests----------

router.get('/create',  studentController.createStudentPage);

router.get('/delete/:id',  studentController.deleteStudent);

//------------Posts Requests----------

router.post('/create-student', studentController.createStudent);

module.exports = router;