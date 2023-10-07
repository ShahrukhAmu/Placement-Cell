const User = require('../models/userSchema');
const flash = require('connect-flash');
const Student = require('../models/studentSchema');
const fs = require('fs');
const bcrypt = require('bcrypt');
const fastcsv = require('fast-csv');
const { model } = require('mongoose');




module.exports.signin = async function(req,res) {
    const user=req.session.user;
    if(user){
        const students = await Student.find({userId: user._id})
        req.flash('success', 'login succesfully');
        res.render('home',{students, user, success:req.flash('success'), error:undefined});
    }
    else{
        res.render('signin',{error:undefined});
    }
};




//render sign up page
module.exports.signup = function (req, res) {
    const message = req.flash('message')[0];
    if (req.isAuthenticated()) {
        return res.redirect('back');
    }
    res.render('signup',{message});
};



//create session
module.exports.createSession=async function (req,res) {
    const {email,password} =req.body;
    const user=await User.findOne({email});
    if(user){
        if(await bcrypt.compare(password,user.password)){
            req.session.user = user;
            const students = await Student.find({userId: user._id})
           return res.render('home', {students,  user , error:undefined});
           
        }
        
        console.log("Wrong password");
        return res.redirect('back');
    }
    
    console.log("email incorrect");
    return res.redirect('back');
}


//signout
module.exports.signout = function (req, res) {
    req.session.user = undefined;
    
    return res.redirect('/users/signin');
};




module.exports.createUser = async function (req, res) {
    const { name, email, password, confirmPassword } = req.body;
    
    const useremail = await User.findOne({ email });
    if (useremail) {
        if (email === useremail.email) {

            console.log("same email");
            return res.redirect('back');
        }
        else {
            if (password === confirmPassword) {
                const hash = await bcrypt.hash(password, 10);
                const user = new User({
                    name,
                    email,
                    password: hash,
                    confirmpassword: hash
                });
                user.save();
                req.flash('success', 'account create succesfully');

                return res.redirect('back');
            }
            
            console.log("password not matching");
            return res.redirect('back');
        }
    }
    else {
        if (password === confirmPassword) {
            const hash = await bcrypt.hash(password, 10);
            const user = new User({
                name,
                email,
                password: hash,
                confirmpassword: hash
            });
            user.save();

            return res.redirect('back');
        }

        console.log("password not matching");
        return res.redirect('back');
    }
}




// download report
module.exports.downloadCsv = async function (req, res) {
    try {
        const students = await Student.find({});

        let data = ''
        let no = 1;
        let csv = 'S.No, Name, Email, College, Placement, Contact Number, Batch, DSA Score, WebDev Score, React Score, Interview, Date, Result';

        for (let student of students) {
            data =
                no +
                ',' +
                student.name +
                ',' +
                student.email +
                ',' +
                student.college +
                ',' +
                student.placement +
                ',' +
                student.contactNumber +
                ',' +
                student.batch +
                ',' +
                student.dsa +
                ',' +
                student.webd +
                ',' +
                student.react;

            if (student.interviews.length > 0) {
                for (let interview of student.interviews) {
                    data += ',' + interview.company + ',' + interview.date.toString() + ',' + interview.result;
                }
            }
            no++;
            csv += '\n' + data;

        }

        const dataFile = fs.writeFile('report/data.csv', csv, function (error, data) {
            if (error) {
                console.log(error);
                return res.redirect('back');
            }
            console.log('Report generated successfully');
            return res.download('report/data.csv');
        });
    } catch (error) {
        console.log(`Error in downloading file: ${error}`);
        return res.redirect('back');
    }
};