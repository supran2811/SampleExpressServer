
const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getMainPage = async (req, res) => {
    const products = await Product.fetchAll();
    res.render("shop/index", { prods: products, pageTitle: "Shop", path: '/' });
}

exports.getAllProducts = async (req, res) => {
    // console.log("Data added ",adminData.products);
    // path.join method allows us to build path which will work on both windows and linux.
    // res.sendFile(path.join(rootDir,"views","shop.html"));
    const products = await Product.fetchAll();
    res.render("shop/product-list", { prods: products, pageTitle: "Shop", path: '/products' });
};

exports.getProductPage = async (req, res) => {
    const { prodId } = req.params;
    const product = await Product.findById(prodId);
    console.log(product);
    res.render("shop/product-details", { pageTitle: product.title, path: "/products", product });
}

exports.getCartPage = async (req, res) => {

    try {
        const cart = await Cart.fetchAll();
        const products = await Product.fetchAll();
        const cartProducts = [];
        for(let product of products) {
            const cartProduct = cart.products.find(p=>p.id === product.id);
            if(cartProduct) {
                cartProducts.push({data:product , qty:cartProduct.qty });
            }
        }
        res.render("shop/cart", { pageTitle: "Cart", path: "/cart" ,products : cartProducts});
    }
    catch(error) {
        res.render("shop/cart", { pageTitle: "Cart", path: "/cart" });
    }
    
}

exports.postCart = (req, res) => {
    const { id, price } = req.body;
    Cart.addToCart(id, price).then(result => {
        res.redirect("/cart");
    }).catch(err => {
        console.log("Error while saving data");
    });
    // res.redirect("/cart");
}

exports.getOrderPage = (req, res) => {
    res.render("shop/order", { pageTitle: "Order", path: "/order" });
}

exports.deleteFromCart = async (req,res) => {
    const { id , price } = req.body;
    try {
        await Cart.deleteFromCart(id , price);
        res.redirect("/cart");
    }
    catch(error) {
        console.log("Error while deleting from cart",error);
    }
    
}