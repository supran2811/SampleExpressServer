const Product = require('../models/product');
const pino = require('../utils/logger');

exports.getAddProducts = (req, res, next) => {
    // path.join method allows us to build path which will work on both windows and linux.
    // __dirname is nodejs inbuild variable which points to the current os directory with route.
    // res.sendFile(path.join(rootDir , 'views' , 'add-product.html'));
    res.render("admin/edit-product", { path: '/admin/add-product', pageTitle: "Add Product", editing: false , isLoggedIn: req.session.isLoggedIn});
};

exports.postAddProduct = async (req, res, next) => {
    const { title, imageUrl, description, price } = req.body;

    const product = new Product({title,imageUrl,price,description,userId: req.user });
    try {
        await product.save();
        res.redirect("/admin/products");
    } catch (error) {
        pino.error(error);
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render("admin/products", { prods: products, pageTitle: "Admin Products", path: '/admin/products', isLoggedIn: req.session.isLoggedIn });
    } catch (error) {
        pino.error(error);
    }
};

exports.getUpdateProduct = async (req, res) => {


    const id = req.params.prodId;
    const { edit } = req.query;
    try {
        const product = await Product.findById(id);
        res.render("admin/edit-product", { product, path: "/admin/products", pageTitle: product.title, editing: edit, isLoggedIn: req.session.isLoggedIn });
    } catch (error) {
        pino.error(error);
    }
}

exports.postUpdateProduct = async (req, res) => {
    const { title, imageUrl, description, price } = req.body;
    const id = req.params.prodId;

    try {
        const product = await Product.findById(id);
        product.title = title;
        product.imageUrl = imageUrl;
        product.description = description;
        product.price = price;
        await product.save(); 
        res.redirect('/admin/products');
    } catch (error) {
        pino.error(error);
    }
}

exports.deleteProduct = async (req, res) => {
    const { id, price } = req.body;
    try {
        await Product.findByIdAndDelete(id);
        res.redirect("/admin/products");

    } catch (err) {
        pino.error(err);
    }


}