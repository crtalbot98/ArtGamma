const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res, next) => {

    res.status(200).sendFile('index.html', { root: './views/draw' });
});

module.exports = router;