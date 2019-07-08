// const products = [];

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
    constructor(title , imageUrl , description , price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    async save() {
        this.id = Math.random().toString();
        const products = await getProductsFromFile();
        products.push(this);
        fs.writeFile(p , JSON.stringify(products));
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