const Student = require('../models/studentSchema');

//render home page
module.exports.homePage = async function(req, res){
    const user = req.session.user;
    if(user){
        res.render('home', {user})
    }
    res.render('signin');
};