const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');
/// This is for handling default root url.
router.get('/products' , shopController.getAllProducts);

router.get('/products/:prodId' , shopController.getProductPage);

router.get('/cart' , isAuth,shopController.getCartPage);

router.post('/cart' , isAuth,shopController.postCart);

router.get('/orders' ,isAuth, shopController.getOrderPage);

router.post('/delete-from-cart', isAuth,shopController.deleteFromCart);

router.post('/checkout' , isAuth,shopController.doCheckout);

router.get('/orders/:orderId' , isAuth , shopController.getInvoice);

module.exports = router;