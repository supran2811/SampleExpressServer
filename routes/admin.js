const express = require('express');

const path = require('path');

const rootDir = require('../utils/path');

const router = express.Router();

/// This is for handling only get request
router.get('/add-product' , (req,res,next) => {
    // path.join method allows us to build path which will work on both windows and linux.
    // __dirname is nodejs inbuild variable which points to the current os directory with route.
    res.sendFile(path.join(rootDir , 'views' , 'add-product.html'));
});

/// This is for handling only post request
router.post('/product' , (req,res,next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;