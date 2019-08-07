const { validationResult } = require('express-validator');
const Product = require('../models/product');
const fileHelper = require('../utils/file');

exports.getAddProducts = (req, res, next) => {
    // path.join method allows us to build path which will work on both windows and linux.
    // __dirname is nodejs inbuild variable which points to the current os directory with route.
    // res.sendFile(path.join(rootDir , 'views' , 'add-product.html'));
    res.render("admin/edit-product", {
        path: '/admin/add-product',
        pageTitle: "Add Product",
        editing: false,
        errorMessage: '',
        validationErrors: [],
        oldInput: {}

    });
};

exports.postAddProduct = async (req, res, next) => {
    const { title, description, price } = req.body;
    const image = req.file;
    console.log("File ====>", image);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessage = errors.array()[0].msg;
        /// 422 is status code for validation fails.
        return res.status(422).render("admin/edit-product", {
            path: '/admin/add-product',
            pageTitle: "Add Product",
            editing: false,
            errorMessage,
            validationErrors: errors.array(),
            oldInput: {
                title,
                price: +price,
                description
            }

        })
    }
    else if (!image) {
        return res.status(422).render("admin/edit-product", {
            path: '/admin/add-product',
            pageTitle: "Add Product",
            editing: false,
            errorMessage: 'Please attach a valid image file',
            validationErrors: [],
            oldInput: {
                title,
                price: +price,
                description
            }

        })
    }
    try {
        const imageUrl = '/' + image.path;
        const product = new Product({ title, imageUrl, price, description, userId: req.user });
        await product.save();
        res.redirect("/admin/products");
    } catch (error) {
        next(error);
    }
}

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find({userId:req.user._id});
        res.render("admin/products", {
            prods: products,
            pageTitle: "Admin Products",
            path: '/admin/products'
        });
    } catch (error) {
        next(error);
    }
};

exports.getUpdateProduct = async (req, res, next) => {


    const id = req.params.prodId;
    const { edit } = req.query;
    try {
        const product = await Product.findById(id);
        res.render("admin/edit-product", {
            product,
            path: "/admin/products",
            pageTitle: product.title,
            editing: edit,
            errorMessage: '',
            oldInput: {},
            validationErrors: []
        });
    } catch (error) {
        next(error);
    }
}

exports.postUpdateProduct = async (req, res, next) => {
    const { title, description, price } = req.body;
    const image = req.file;
    const id = req.params.prodId;
    const errors = validationResult(req);

    try {
        const product = await Product.findById(id);
        if (product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        }

        if (!errors.isEmpty()) {
            const errorMessage = errors.array()[0].msg;
            /// 422 is status code for validation fails.
            return res.status(422).render("admin/edit-product", {
                product,
                path: "/admin/products",
                pageTitle: product.title,
                editing: true,
                errorMessage,
                validationErrors: errors.array(),
                oldInput: {
                    title,
                    price: +price,
                    description
                }
            })
        }

        product.title = title;

        if (image) {
            fileHelper.deleteFile(product.imageUrl.substr(1));
            product.imageUrl = '/' + image.path;
        }

        product.description = description;
        product.price = price;
        await product.save();
        res.redirect('/admin/products');
    } catch (error) {
        next(error);
    }
}

exports.deleteProduct = async (req, res) => {
    const { prodId } = req.params;
    try {
        const product = await Product.findById(prodId);
        if (product) {
            fileHelper.deleteFile(product.imageUrl.substr(1));
            await Product.deleteOne({ _id: prodId, userId: req.user._id });
        }
        res.status(200).json({message:'Sucess!'});
        // res.redirect("/admin/products");

    } catch (err) {
        res.status(500).json({message:'Error!'});
    }


}