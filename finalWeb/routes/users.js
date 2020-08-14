const express = require('express');
const queries = require('../models/mongoQueries.js');
const router = express.Router();
const User = require('../models/user.js');

router.get('/', async (req,res) => {

    if(req.isAuthenticated()){

        const user = new User(req.user);

        const userDrawings = await queries.getUserDrawings(user.email);

        let userData = {
            email: user.email,
            name: `${user.givenName} ${user.familyName}`,
            drawing: userDrawings
        }

        res.status(200).json(userData);
        
    }
    else{

        res.status(200).json({error: 'please login'});        
    }
});

router.get('/logout', function(req, res, next) {

  req.logout();
  res.redirect('../');
});

module.exports = router;