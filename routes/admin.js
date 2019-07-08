const express = require('express');

const path = require('path');


const router = express.Router();

const adminController = require('../controllers/admin');

/// This is for handling only get request
router.get('/add-product' , adminController.getAddProducts);

router.get('/products' , adminController.getAllProducts);

/// This is for handling only post request
router.post('/add-product' , adminController.postAddProduct);

module.exports = router;
