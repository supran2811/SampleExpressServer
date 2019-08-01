const express = require('express');

const path = require('path');


const router = express.Router();

const isAuth = require('../middleware/is-auth');


const adminController = require('../controllers/admin');

/// This is for handling only get request
router.get('/add-product' , isAuth,adminController.getAddProducts);

router.get('/products' , isAuth,adminController.getAllProducts);

// /// This is for handling only post request
router.post('/add-product' , isAuth,adminController.postAddProduct);

router.get('/edit-product/:prodId' , isAuth,adminController.getUpdateProduct);

router.post('/update-product/:prodId' , isAuth,adminController.postUpdateProduct);

router.post('/delete-product' , isAuth,adminController.deleteProduct);
module.exports = router;
