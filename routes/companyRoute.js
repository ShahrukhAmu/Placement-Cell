const express = require('express');
const passport = require('passport');
const companyController = require('../controllers/companyController');
const router = express.Router();

//----------Get Requests--------
router.get('/home',  companyController.companyPage);

router.get('/allocate',  companyController.allocateInterview);

//----------Post Requests

router.post('/schedule-interview',  companyController.scheduleInterview);

router.post('/update-status/:id',  companyController.updateStatus);

module.exports = router;


