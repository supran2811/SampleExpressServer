const Product  = require('../models/product');

exports.getAddProducts = (req,res,next) => {
    // path.join method allows us to build path which will work on both windows and linux.
    // __dirname is nodejs inbuild variable which points to the current os directory with route.
    // res.sendFile(path.join(rootDir , 'views' , 'add-product.html'));
    res.render("admin/add-product" , {path:'/admin/add-product' , pageTitle : "Add Product"});
};

exports.postAddProduct = (req,res,next) => {
    const {title , imageUrl , description , price} = req.body;
    const product = new Product(title, imageUrl , description , price);
    product.save();
    res.redirect('/');
}

exports.getAllProducts = async (req,res) => {
    // console.log("Data added ",adminData.products);
    // path.join method allows us to build path which will work on both windows and linux.
   // res.sendFile(path.join(rootDir,"views","shop.html"));
   const products = await Product.fetchAll();
   res.render("admin/products" , {prods: products , pageTitle:"Admin Products" , path:'/admin/products'});
};