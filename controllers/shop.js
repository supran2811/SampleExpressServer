const Product  = require('../models/product');

exports.getMainPage = async (req,res) => {
    const products = await Product.fetchAll();
    res.render("shop/index" , {prods: products , pageTitle:"Shop" , path:'/'});
}

exports.getAllProducts = async (req,res) => {
    // console.log("Data added ",adminData.products);
    // path.join method allows us to build path which will work on both windows and linux.
   // res.sendFile(path.join(rootDir,"views","shop.html"));
   const products = await Product.fetchAll();
   res.render("shop/product-list" , {prods: products , pageTitle:"Shop" , path:'/products'});
};

exports.getProductPage = async (req,res) => {
    const { prodId } = req.params;
    const product = await Product.findById(prodId);
    console.log(product);
    res.render("shop/product-details" , {pageTitle:product.title, path:"/products" , product});
}

exports.getCartPage = (req,res) => {
    res.render("shop/cart" , {pageTitle:"Cart" , path:"/cart"});
}

exports.postCart = (req,res) => {
    const id = req.body.id;
    console.log(id);
    res.redirect("/cart");
}

exports.getOrderPage = (req,res) => {
    res.render("shop/order" , {pageTitle:"Order" , path:"/order"});
}
