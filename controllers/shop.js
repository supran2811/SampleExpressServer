
const pino = require('../utils/logger');
const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

exports.getMainPage = async (req, res) => {
    try {
        const products = await Product.find();
        res.render("shop/index", { prods: products, pageTitle: "Shop", path: '/' });
    } catch (error) {
        pino.error(error);
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        console.log("Products======>",products);
        res.render("shop/product-list", { prods: products, pageTitle: "Shop", path: '/products' });
    } catch (error) {
        pino.error(error);
    }
};

exports.getProductPage = async (req, res) => {
    const { prodId } = req.params;
    try {
        const product = await Product.findById(prodId);
        
        res.render("shop/product-details", { pageTitle: product.title, path: "/products", product });
    } catch (error) {
        pino.error(error);
    }

}

exports.getCartPage = async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.prodId').execPopulate();
        const cartProducts = user.cart.items;
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
        const product = await Product.findById(id);
        await req.user.addToCart(product);
        res.redirect("/cart");
    } catch(error) {
        pino.error(error);
    }
}

exports.doCheckout = async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.prodId').execPopulate();
        const items = user.cart.items.map(({prodId , qty}) => {
            return { product : {...prodId._doc} , qty}
        })
        const order = new Order({
            user : {
                userId : req.user._id,
                name : req.user.name
            },
            items
        })
        await order.save();
        await req.user.clearCart();
        res.redirect('/order');
        // Redirect to the order page
    } catch (error) {
        pino.error(error);
    }
}

exports.getOrderPage = async (req, res) => {
    try {
        const orders = await Order.find({
            user : {
                userId : req.user._id,
                name : req.user.name
            }
        });

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