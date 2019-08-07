const express = require('express');

const path = require('path');

const { check, body, oneOf } = require('express-validator');

const router = express.Router();

const isAuth = require('../middleware/is-auth');

const adminController = require('../controllers/admin');

/// This is for handling only get request
router.get('/add-product', isAuth, adminController.getAddProducts);

router.get('/products', isAuth, adminController.getAllProducts);

// /// This is for handling only post request
router.post('/add-product',
    isAuth,
    [check('title')
        .trim()
        .isLength({ min: 4 })
        .withMessage("Enter a valid product name of mininum 4 letters"),
    check('price')
        .isFloat()
        .withMessage('Enter a valid number for  price'),
    check('description')
        .trim()
        .isLength({ min: 10 })
        .withMessage("Enter a valid description of mininum 10 letters")],
    adminController.postAddProduct);

router.get('/edit-product/:prodId',
    isAuth,
    adminController.getUpdateProduct);

router.post('/update-product/:prodId', isAuth,
    [check('title')
        .trim()
        .isLength({ min: 4 })
        .withMessage("Enter a valid product name of mininum 4 letters"),
    check('price')
        .isFloat()
        .withMessage('Enter a valid number for  price'),
    check('description')
        .trim()
        .isLength({ min: 10 })
        .withMessage("Enter a valid description of mininum 10 letters")]
    , adminController.postUpdateProduct);

router.delete('/product/:prodId', isAuth, adminController.deleteProduct);
module.exports = router;
