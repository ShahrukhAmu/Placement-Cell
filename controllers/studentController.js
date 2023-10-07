const { model } = require('mongoose');
const Company = require('../models/companySchema');
const Student = require('../models/studentSchema');

// render create student page
module.exports.createStudentPage = async function(req, res){
    return res.render('add_student');
};

// create student
module.exports.createStudent = async function(req, res){
    const { name, email, batch, college, placement, contactNumber, dsa, webd, react} = req.body;
    const user = req.session.user;
    try {
        const student = await Student.findOne({email});

        if(student){
            console.log('Email already exists');
            return res.redirect('back');
        }

        const newStudent = await Student.create({
            userId:user._id,
            name,
            email,
            college,
            batch,
            placement,
            contactNumber,
            dsa,
            webd,
            react,
        });
        await newStudent.save();

        return res.redirect('/');

    } catch(error){
        console.log(`Error in creating student: ${error}`);
        return res.redirect('back');
    }
};

//edit Student
module.exports.deleteStudent = async function(req, res) {
    const{ id } = req.params;
    console.log(req.params);
    try{
        

        await Student.findOneAndDelete(id);
        res.redirect('/');
    } catch (error){
        console.log('Error in deleting student');
        return res.redirect('/');
    }
};
