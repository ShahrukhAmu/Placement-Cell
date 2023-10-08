const Student = require('../models/studentSchema');

//render home page
module.exports.homePage = async function(req, res){
    const user = req.session.user;
    if(user){
        
        const students = await Student.find({});
        console.log(students);
        res.render('home', {user, students});
    }
    res.render('signin');
};