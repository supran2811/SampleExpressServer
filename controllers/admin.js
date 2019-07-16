const Product = require('../models/product');
const pino = require('../utils/logger');

exports.getAddProducts = (req, res, next) => {
    // path.join method allows us to build path which will work on both windows and linux.
    // __dirname is nodejs inbuild variable which points to the current os directory with route.
    // res.sendFile(path.join(rootDir , 'views' , 'add-product.html'));
    res.render("admin/edit-product", { path: '/admin/add-product', pageTitle: "Add Product", editing: false });
};

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, description, price } = req.body;

    req.user.createProduct({
        title,
        price,
        imageUrl,
        description
    }).then(result => {
        res.redirect('/');
    }).catch(error => {
        pino.error(error);
    });
}

exports.getAllProducts = async (req, res) => {
    // console.log("Data added ",adminData.products);
    // path.join method allows us to build path which will work on both windows and linux.
    // res.sendFile(path.join(rootDir,"views","shop.html"));
    //const products = await Product.fetchAll();

    try {
        const products = await req.user.getProducts();
        res.render("admin/products", { prods: products, pageTitle: "Admin Products", path: '/admin/products' });
    } catch (error) {
        pino.error(error);
    }

};

exports.getUpdateProduct = async (req, res) => {
    const id = req.params.prodId;
    const { edit } = req.query;
    try {
        const products = await req.user.getProducts({where:{id}});
        const product = products[0];
        res.render("admin/edit-product", { product, path: "/admin/products", pageTitle: product.title, editing: edit });
    } catch(error) {
        pino.error(error);
    }
    
}

exports.postUpdateProduct = (req, res) => {
    const { title, imageUrl, description, price } = req.body;
    const id = req.params.prodId;
    //console.log("New Product", title);
    //const product = new Product(title, imageUrl, description, price, id);
    //product.save();
    Product.findByPk(id).then(product => {
        product.title = title;
        product.price = price;
        product.imageUrl = imageUrl;
        product.description = description;
        return product.save();
    }).then(result => {
        res.redirect("/admin/products");
    }).catch(error => {
        pino.error(`Error while updating product ${id} ${error}`);
    })
    
}

exports.deleteProduct = async (req, res) => {
    const { id, price } = req.body;
    try {
        // await Product.delete(id, price);
        await Product.destroy({
            where:{id}
        });
        res.redirect("/admin/products");
    } catch (err) {
        pino.error(err);
    }

    
}