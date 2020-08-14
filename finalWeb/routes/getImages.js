const express = require('express');
const {Storage} = require('@google-cloud/storage');
const path = require('path');
const fs = require('fs');
const queries = require('../models/mongoQueries.js');
const router = express.Router();
const User = require('../models/user.js');

router.post('/', (req, res, next) => { // check if login or not...

    const user = new User(req.user);

    const gcs = new Storage({
        keyFilename: path.join(__dirname, '..', 'config', 'cit-41200-final-project-272919-1b98b23c5e97.json'),
        projectId: 'cit-41200-final-project-272919'
    });

    const tempImgPath = path.join(__dirname, '..', 'temp_Imgs');

    const imgBucket = gcs.bucket('41200-final-drawings');
    const imgName = req.body.name;
    const imgData = req.body.data;
    
    const imgBuf = Buffer.from(imgData, "base64");

    fs.writeFile(`${tempImgPath}/${user.email}-${imgName}.jpg`, imgBuf, 'binary', function(err) {
        if(err) console.log(err);
    });

    imgBucket.upload(`${tempImgPath}/${user.email}-${imgName}.jpg`, function(err, file) {
        if (err) throw new Error(err);

        fs.unlink(`${tempImgPath}/${user.email}-${imgName}.jpg`, (err) => {
            if (err) throw err;
            console.log(`successfully deleted ${tempImgPath}/${user.email}-${imgName}.jpg`);
        });
    });

    res.status(200).send();
});

router.get('/', async (req, res, next) => {


    const drawings = await queries.getDrawings();

    res.status(200).json(drawings);

});



module.exports = router;