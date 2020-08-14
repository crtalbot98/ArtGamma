const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');

router.get('/', async (req,res) => {
    res.status(200).sendFile('index.html', { root: './views/forms/signup' });
});

router.post('/', passport.authenticate('local', { successRedirect: '/',
            
    failureRedirect: '/signup',
    failureFlash: true })

);

signInToDB = async (userData, done, body) => {

    let userObj = {
        name: {
            givenName: body.first_name,
            familyName: body.last_name
        },
        emails: [{value: body.username}]
    };

    if(body.type === 'signin'){
        await User.checkUserExists(userData, 'local', async (err, data) =>{
        if(err){
            console.log("ERROR : ", err);            
        } 
        else{      
            if(!checkLength(data.length)){
                return done(null, false, { message: 'User does not exist!' });
                console.log('incheckuser');
                return;
            }
            else{
                await User.checkPassword(userData.email, userData.password, async (err, correct, data) => {
                    if(err){
                        console.log("ERROR : ", err);            
                    } 
                    else if(correct){
                        console.log('in correct pass');
                        return done(null, userObj);
                    }
                    else if(!correct){
                        console.log('in incorrect pass');
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                });
            }
        }
    });
    }
    else if(body.type === 'signup'){

        bcrypt.hash(body.password, 10, async (err, hash) => {
            if(err) console.log(err);

            userObj.password = hash;

            await User.checkUserExists(userObj, 'local', async (err, data) =>{
                if(err){
                    console.log("ERROR : ", err);            
                } 
                else{      
                    console.log(data.length);
                    if(checkLength(data.length)){
                        return done(null, false, { message: 'User already exists!' });
                    }
                    
                    await User.addUser(userObj, 'local', done);
                }
            });
        });
    }
}

passport.use(new LocalStrategy({
    passReqToCallback: true
    },
    function(req, username, password, done) {
        const body = req.body;
        signInToDB({email: username, password: password}, done, body);
    }                          
));

checkLength = (length) => {

    if(Number(length) > 0) {
        return true;
    }
    else{
        return false;
    }
}

module.exports = router;