const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/userSchema');

const local = new LocalStrategy({
    usernameField: 'email'},async function(
        email,
        password,
        done
    ) {
        try{
            const user = await User.findOne({email});

            if(user){
                if(await bcrypt.compare(password, user.passwordHash)){
                    req.session.user = user;
                    return done(null, user)
                   
                }
            }
            if(!user){
                 console.log('Invalid Username/Password');
                 return done(null, false);
            } 
             
        } catch (error) {
            console.log(`Error in finding user: ${error}`);
            return done(error);
        }
        

        
    }
);

passport.use('local', local);

//serialize user

passport.serializeUser(function(user, done){
    done(null, user.id);
});

//deserialize user
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user-->Passport');
            return done(err);
        }
        return done(null, user);
    });
});

//check if user is authenticated
passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/users/signin');
};

// set authenticated user for views
passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
};