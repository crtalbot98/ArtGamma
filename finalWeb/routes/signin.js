const express = require('express');
const router = express.Router();
const connection = require('../db');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');
const bcrypt = require('bcrypt');

router.get('/', (req, res, next) => {

    res.status(200).sendFile('index.html', { root: './views/forms/signin' });
});

router.post('/', passport.authenticate('local', { successRedirect: '/',
            
    failureRedirect: '/signin',
    failureFlash: true })

);

//GET login request
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email']})
);

//GET return request
router.get('/google/return',
    //middleware
    passport.authenticate('google', {failureRedirect: './'}),
    //callback
    //whats going to happen when we have an authenticated user
    async function(req, res){

        let userObj = {
            first_name: req.user.name.givenName,
            last_name: req.user.name.familyName,
            email: req.user.emails[0].value,
            password: null,
            user_id: req.user.id
        };

        await User.checkUserExists(userObj, 'google', async (err, data) =>{
            if(err){
                console.log("ERROR : ", err);            
            } 
            else{      

            if(checkLength(data.length)){
                console.log('user exists');
                res.status(200).json({'error': 'user exists'});
                return;
            }
            
            await User.addUser(userObj, 'google',
                () => {
                    res.status(200).send();
            });
        }
    });

        res.redirect('../../');
    }
);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://cit-41200-final-project-272919.uc.r.appspot.com/signin/google/return'
},
(accessToken, refreshToken, profile, callback) => {
    //returns users google profile
    //callback has two parameters: error, and user object
    return callback(null, profile);
}));

passport.serializeUser( function(user, callback){

  callback(null, user);
});

passport.deserializeUser( function(obj, callback){

  callback(null, obj);
});



module.exports = router;