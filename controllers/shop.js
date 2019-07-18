
const Product = require('../models/product');

const pino = require('../utils/logger');

exports.getMainPage = async (req, res) => {
    const products = await Product.fetchAll();
    res.render("shop/index", { prods: products, pageTitle: "Shop", path: '/' });
}

exports.getAllProducts = async (req, res) => {
    const products = await Product.fetchAll();
    res.render("shop/product-list", { prods: products, pageTitle: "Shop", path: '/products' });
};

exports.getProductPage = async (req, res) => {
    const { prodId } = req.params;

    const product = await Product.findByid(prodId);
    res.render("shop/product-details", { pageTitle: product.title, path: "/products", product });
   
}

// exports.getCartPage = async (req, res) => {
//     try {
//         const cart = await req.user.getCart();
//         if (cart) {
//             console.log("CART =========>", cart.getProducts);
//             const cartProducts = await cart.getProducts();
//             res.render("shop/cart", { pageTitle: "Cart", path: "/cart", products: cartProducts });
//         }
//     } catch (error) {
//         pino.error(error);
//     }
// }

// exports.postCart = async (req, res) => {
//     const { id } = req.body;
//     try {
//         let qty = 1;
//         let cartProduct;
//         const cart = await req.user.getCart();
//         const cartProducts = await cart.getProducts({ where: { id } });
//         if (cartProducts.length > 0) {
//             cartProduct = cartProducts[0];
//             qty = +cartProduct.cartItem.qty + 1;
//         }
//         else {
//             cartProduct = await Product.findByPk(id);
//         }
//         await cart.addProduct(cartProduct, { through: { qty } });
//         res.redirect("/cart");
//     } catch (error) {
//         pino.error(error);
//     }
// }

// exports.doCheckout = async (req, res) => {
//     try {
//         /// Get products in the cart of the user
//         const cart = await req.user.getCart();
//         const cartProducts = await cart.getProducts();

//         /// create a new order for the user

//         const order = await req.user.createOrder();

//         /// move product to the order model

//         await order.addProducts(cartProducts.map(product => {
//             product.orderItem = { qty: product.cartItem.qty };
//             return product;
//         }));

//         /// clean the cart

//         await cart.setProducts(null);

//         res.redirect('/order');
//         // Redirect to the order page
//     } catch (error) {
//         pino.error(error);
//     }
// }

// exports.getOrderPage = async (req, res) => {

//     /// Fetch products from the order model 
//     /// add include inorder to include products inside the order items.
//     try {
//         const orders = await req.user.getOrders({ include: ['products'] });

//         res.render("shop/order", { pageTitle: "Order", path: "/order", orders });
//     } catch (error) {
//         pino.error(error);
//     }
// }

// exports.deleteFromCart = async (req, res) => {
//     const { id } = req.body;
//     try {
//         const cart = await req.user.getCart();
//         const cartProducts = await cart.getProducts({ where: { id } });
//         if (cartProducts.length > 0) {
//             const cartProduct = cartProducts[0];
//             await cartProduct.cartItem.destroy();
//         }
//         res.redirect("/cart");
//     }
//     catch (error) {
//         pino.error(error);
//     }

// }