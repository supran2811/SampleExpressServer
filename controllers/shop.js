
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const stripe = require('stripe')(process.env.STRPE_KEY);

const Product = require('../models/product');
const User = require('../models/user');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 2;

exports.getMainPage = async (req, res, next) => {
    const { page = 1 } = req.query;
    try {
        const totalItems = await Product.find().countDocuments();
        const products = await Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);
        res.render("shop/index", {
            prods: products,
            pageTitle: "Shop",
            path: '/',
            currentPage: +page,
            hasNextPage: ((page * ITEMS_PER_PAGE) < totalItems),
            hasPrevPage: +page > 1,
            nextPage: +page + 1,
            prevPage: +page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });

    } catch (error) {
        ////Throwing a error here wont work since its asynchronous code
        /// So we need to call next with error.
        next(error);
    }
}

exports.getAllProducts = async (req, res, next) => {
    try {
        const { page = 1 } = req.query;
        const totalItems = await Product.find().countDocuments();
        const products = await Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE);

        res.render("shop/product-list", {
            prods: products,
            pageTitle: "Shop",
            path: '/products',
            currentPage: +page,
            hasNextPage: ((page * ITEMS_PER_PAGE) < totalItems),
            hasPrevPage: +page > 1,
            nextPage: +page + 1,
            prevPage: +page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    } catch (error) {
        ////Throwing a error here wont work since its asynchronous code
        /// So we need to call next with error.
        next(error);
    }
};

exports.getProductPage = async (req, res) => {
    const { prodId } = req.params;
    try {
        const product = await Product.findById(prodId);

        res.render("shop/product-details", {
            pageTitle: product.title,
            path: "/products",
            product
        });
    } catch (error) {
        ////Throwing a error here wont work since its asynchronous code
        /// So we need to call next with error.
        next(error);
    }

}

exports.getCartPage = async (req, res, next) => {
    try {
        const user = await req.user.populate('cart.items.prodId').execPopulate();
        const cartProducts = user.cart.items;
        if (cartProducts) {
            res.render("shop/cart", {
                pageTitle: "Cart",
                path: "/cart",
                products: cartProducts
            });
        }
    } catch (error) {
        ////Throwing a error here wont work since its asynchronous code
        /// So we need to call next with error.
        next(error);
    }
}

exports.getCheckout = async (req, res, next) => {
    try {
        const user = await req.user.populate('cart.items.prodId').execPopulate();
        const cartProducts = user.cart.items;
        const totalPrice = cartProducts.reduce((accumulator, item) => {
            return accumulator + (item.qty * item.prodId.price)
        }, 0);
        if (cartProducts) {
            res.render("shop/checkout", {
                pageTitle: "Checkout",
                path: "/checkout",
                products: cartProducts,
                totalPrice
            });
        }
    } catch (error) {
        ////Throwing a error here wont work since its asynchronous code
        /// So we need to call next with error.
        next(error);
    }
}

exports.postCart = async (req, res) => {
    const { id } = req.body;
    try {
        const product = await Product.findById(id);
        await req.user.addToCart(product);
        res.redirect("/cart");
    } catch (error) {
        ////Throwing a error here wont work since its asynchronous code
        /// So we need to call next with error.
        next(error);
    }
}

exports.doCreateOrder = async (req, res) => {
    try {
        const token = req.body.stripeToken; 
        const user = await req.user.populate('cart.items.prodId').execPopulate();
        const items = user.cart.items.map(({ prodId, qty }) => {
            return { product: { ...prodId._doc }, qty }
        });
        const totalPrice = user.cart.items.reduce((accumulator, item) => {
            return accumulator + (item.prodId.price * item.qty);
        }, 0);
        const order = new Order({
            user: {
                userId: req.user._id,
                email: req.user.email
            },
            items
        })
        const result = await order.save();
        /** This is using stripe to start doing the payment */
        const charge = stripe.charges.create({
            amount: totalPrice * 100,
            currency: 'usd',
            description: 'Demo Order',
            source: token,
            metadata: { order_id: result._id.toString() }
        });
        await req.user.clearCart();
        res.redirect('/orders');
        // Redirect to the order page
    } catch (error) {
        ////Throwing a error here wont work since its asynchronous code
        /// So we need to call next with error.
        next(error);
    }
}

exports.getOrderPage = async (req, res) => {
    try {
        const orders = await Order.find({
            user: {
                userId: req.user._id,
                email: req.user.email
            }
        });

        res.render("shop/order", {
            pageTitle: "Order",
            path: "/orders",
            orders
        });
    } catch (error) {
        ////Throwing a error here wont work since its asynchronous code
        /// So we need to call next with error.
        next(error);
    }
}

exports.deleteFromCart = async (req, res) => {
    const { id } = req.body;
    try {
        await req.user.deleteFromCart(id);
        res.redirect("/cart");
    }
    catch (error) {
        ////Throwing a error here wont work since its asynchronous code
        /// So we need to call next with error.
        next(error);
    }

}

exports.getInvoice = async (req, res, next) => {
    const { orderId } = req.params;
    try {

        const order = await Order.findById(orderId);
        if (!order) {
            return next(new Error('No order found!'));
        }
        if (order.user.userId.toString() !== req.user._id.toString()) {
            return next(new Error('Unauthorised access!!!'));
        }
        const fileName = 'invoice-' + orderId + '.pdf';
        /** Important:
         This approach works well for small files
         Since it will load the entire file inside node
         It cosumes lot of memory */
        // fs.readFile(path.join('data', 'invoices', fileName), (err, data) => {
        //     if (err) {
        //         return next(err);
        //     }
        //     res.setHeader('Content-Type', 'application/pdf');
        //     res.setHeader('Content-Disposition', 'inline; filename=' + fileName);
        //     return res.send(data);
        // });
        fs.access(path.join('data', 'invoices', fileName), (err) => {
            if (err) {
                /**
                 * Important
                 * PDFKit is used to generate pdf on the fly
                 * 
                 */
                const pdfDoc = new PDFDocument();

                //res.setHeader('Content-Type', 'application/pdf');
                //res.setHeader('Content-Disposition', 'inline; filename=' + fileName);
                pdfDoc.pipe(fs.createWriteStream(path.join('data', 'invoices', fileName)));

                pdfDoc.pipe(res);

                pdfDoc.fontSize(26).text('Invoice');
                pdfDoc.text('---------------------------------');
                pdfDoc.fontSize(16)
                let totalPrice = 0;
                order.items.forEach(({ product, qty }) => {
                    const { title, price } = product;
                    pdfDoc.text(title + '-' + qty + '*' + price);
                    totalPrice += price * qty;
                });
                pdfDoc.text('---------------------------------');
                pdfDoc.fontSize(20);
                pdfDoc.text('Total Price:' + totalPrice);
                pdfDoc.end();
            }
            else {
                /**
                *  Important
                *  This approach we are streaming the content to the browser.
                *  So browser will concatenate the content and show it to the user
                * 
                */
                const file = fs.createReadStream(path.join('data', 'invoices', fileName));
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'inline; filename=' + fileName);
                file.pipe(res);
            }
        });




    } catch (err) {
        next(err);
    }
}
