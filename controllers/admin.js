const Product  = require('../models/product');

exports.getAddProducts = (req,res,next) => {
    // path.join method allows us to build path which will work on both windows and linux.
    // __dirname is nodejs inbuild variable which points to the current os directory with route.
    // res.sendFile(path.join(rootDir , 'views' , 'add-product.html'));
    res.render("admin/edit-product" , {path:'/admin/add-product' , pageTitle : "Add Product" , editing:false});
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

exports.getUpdateProduct = async (req,res) => {
    const id = req.params.prodId;
    const { edit } = req.query;
    const product = await Product.findById(id);
    res.render("admin/edit-product" , {product , path:"/admin/products" , pageTitle:product.title , editing: edit});
}

exports.postUpdateProduct = (req,res) => {
    const {title , imageUrl , description , price} = req.body;
    const id = req.params.prodId;
    console.log("New Product" , title);
    const product = new Product(title, imageUrl , description , price,id);
    product.save();
    res.redirect("/admin/products");
}

exports.deleteProduct = async (req,res) => {
    const { id ,  price} = req.body;
    try {
        await Product.delete(id,price);
    } catch(err) {
        console.log("Error occured while deleting the content");
    }
    
    res.redirect("/admin/products");
}