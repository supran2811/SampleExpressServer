// const products = [];
const Cart = require('./cart');
const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = () => {

    return new Promise((resolve, reject) => {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                resolve([]);
            }
            else {
                resolve(JSON.parse(fileContent));
            }
        })
    });
}

module.exports = class Product {
    constructor(title, imageUrl, description, price, id) {
        this.id = id || Math.random().toString();
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    async save() {
        const products = await getProductsFromFile();
        const existingProductIndex = products.findIndex(p => p.id === this.id);
        if (existingProductIndex === -1) {
            products.push(this);
        }
        else {
            products[existingProductIndex] = this;
        }
        fs.writeFile(p, JSON.stringify(products));
    }

    static async delete(id,price) {
        try {
            const products = await getProductsFromFile();
            
            const updatedProducts = products.filter(p => p.id !== id);

            fs.writeFile(p, JSON.stringify(updatedProducts), async err => {
                if (!err) {
                    try {
                        await Cart.deleteFromCart(id,price);
                    } catch (err) {
                        console.log("Error occured while deleteing the content from cart", err);
                    }
                }
            });
        } catch(err) {
            console.log("Error while fetching the products",err);
        }
        
    }

    static async fetchAll() {
        return await getProductsFromFile();
    }

    static async findById(id) {
        const products = await getProductsFromFile();
        const product = products.find(p => p.id === id);
        return product;
    }
}