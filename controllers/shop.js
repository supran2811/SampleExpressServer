
const Product = require('../models/product');
const User = require('../models/user');

const pino = require('../utils/logger');

exports.getMainPage = async (req, res) => {
    try {
        const products = await Product.fetchAll();
        res.render("shop/index", { prods: products, pageTitle: "Shop", path: '/' });
    } catch (error) {
        pino.error(error);
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.fetchAll();
        console.log("Products======>",products);
        res.render("shop/product-list", { prods: products, pageTitle: "Shop", path: '/products' });
    } catch (error) {
        pino.error(error);
    }
};

exports.getProductPage = async (req, res) => {
    console.log("Params ",req.params);
    const { prodId } = req.params;
    try {
        pino.info("product="+prodId);
        const product = await Product.findByid(prodId);
        
        res.render("shop/product-details", { pageTitle: product.title, path: "/products", product });
    } catch (error) {
        pino.error(error);
    }

}

exports.getCartPage = async (req, res) => {
    try {
        const cartProducts = await req.user.getCart();
        if (cartProducts) {
            res.render("shop/cart", { pageTitle: "Cart", path: "/cart", products: cartProducts });
        }
    } catch (error) {
        pino.error(error);
    }
}

exports.postCart = async (req, res) => {
    const { id } = req.body;
    try {   
        const product = await Product.findByid(id);
        await req.user.addToCart(product);
        res.redirect("/cart");
    } catch(error) {
        pino.error(error);
    }
}

exports.doCheckout = async (req, res) => {
    try {

        await req.user.addOrder();

        res.redirect('/order');
        // Redirect to the order page
    } catch (error) {
        pino.error(error);
    }
}

exports.getOrderPage = async (req, res) => {
    try {
        const orders = await req.user.getOrders();

        res.render("shop/order", { pageTitle: "Order", path: "/order", orders });
    } catch (error) {
        pino.error(error);
    }
}

exports.deleteFromCart = async (req, res) => {
    const { id } = req.body;
    try {
        await req.user.deleteFromCart(id);
        res.redirect("/cart");
    }
    catch (error) {
        pino.error(error);
    }

}