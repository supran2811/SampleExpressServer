const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');

/// This is for handling default root url.
router.get('/products' , shopController.getAllProducts);

router.get('/products/:prodId' , shopController.getProductPage);

router.get('/cart' , shopController.getCartPage);

router.post('/cart' , shopController.postCart);

router.get('/order' , shopController.getOrderPage);

router.post('/delete-from-cart', shopController.deleteFromCart);

module.exports = router;