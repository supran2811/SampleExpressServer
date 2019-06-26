const express = require('express');

const path = require('path');

const rootDir = require('../utils/path');

const router = express.Router();

/// This is for handling default root url.
router.get('/' , (req,res) => {
    // path.join method allows us to build path which will work on both windows and linux.
    res.sendFile(path.join(rootDir,"views","shop.html"));
});

module.exports = router;