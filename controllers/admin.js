const Product = require('../models/product');
const pino = require('../utils/logger');

exports.getAddProducts = (req, res, next) => {
    // path.join method allows us to build path which will work on both windows and linux.
    // __dirname is nodejs inbuild variable which points to the current os directory with route.
    // res.sendFile(path.join(rootDir , 'views' , 'add-product.html'));
    res.render("admin/edit-product", { path: '/admin/add-product', pageTitle: "Add Product", editing: false });
};

exports.postAddProduct = async (req, res, next) => {
    const { title, imageUrl, description, price } = req.body;

    const product = new Product(title, price, imageUrl, description);
    await product.save();
}

exports.getAllProducts = async (req, res) => { 
    const products = await Product.fetchAll();
    res.render("admin/products", { prods: products, pageTitle: "Admin Products", path: '/admin/products' });
};

exports.getUpdateProduct = async (req, res) => {
    const id = req.params.prodId;
    const { edit } = req.query;
 
    const product = await Product.findByid(id);
    res.render("admin/edit-product", { product, path: "/admin/products", pageTitle: product.title, editing: edit });
}

exports.postUpdateProduct = async (req, res) => {
    const { title, imageUrl, description, price } = req.body;
    const id = req.params.prodId;
    
    const product = new Product(title,price, imageUrl, description );
    await product.update(id);
    res.redirect('/admin/products');
}

exports.deleteProduct = async (req, res) => {
    const { id, price } = req.body;
    try {
        await Product.deleteById(id);
        res.redirect("/admin/products");
    } catch (err) {
        pino.error(err);
    }


}