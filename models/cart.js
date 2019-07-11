const fs = require("fs");
const path = require('path');
const rootDir = require('../utils/path');
const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
    static addToCart(id, price) {
        return new Promise((resolve, reject) => {
            let cart = { products: [], totalPrice: 0 };
            fs.readFile(p, (err, fileContent) => {
                if (!err) {
                    cart = JSON.parse(fileContent);
                }

                const existingProductIndex = cart.products.findIndex(p => p.id === id);
                let product;
                if (existingProductIndex !== -1) {
                    product = cart.products[existingProductIndex];
                    product.qty += 1;
                }
                else {
                    product = { id, qty: 1 };
                    cart.products.push(product);
                }
                cart.totalPrice = cart.totalPrice + +price;
                fs.writeFile(p, JSON.stringify(cart), (err) => {
                    if (!err) {
                        resolve(true);
                    }
                    else {
                        reject(err);
                    }
                })
            });
        })
    }
    static fetchAll() {
        return new Promise((resolve,reject) => {
            fs.readFile(p, (err, fileContent) => {
                if(!err) {
                    const cart = JSON.parse(fileContent);
                    resolve(cart);
                }
                else {
                    reject(err);
                }
            });
        })
    }
    static deleteFromCart(id, price) {
        return new Promise((resolve, reject) => {
            fs.readFile(p, (err, fileContent) => {
                if (!err) {
                    let cart = JSON.parse(fileContent);
                    let qty;
                    const products = cart.products.filter(p => {
                        if(p.id === id) {
                            qty = p.qty;
                            return false;
                        }
                        return true;
                    });
                    const totalPrice = cart.totalPrice - (+price * qty);
                    // const products = cart.products.filter(p => p.id === id);
                    cart = { ...cart, products, totalPrice };
                    fs.writeFile(p, JSON.stringify(cart), (err) => {
                        if (!err) {
                            resolve(true);
                        }
                        else {
                            reject(err);
                        }
                    })


                }
                else {
                    reject(err);
                }

            })
        })
    }
}