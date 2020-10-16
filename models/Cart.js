const db = require('./db');
const fs = require('fs');
const path = require('path');
//const {v1:uuidv1} = require('uuid');

const appDir = path.dirname(require.main.filename);
const p = path.join(appDir, 'data', 'carts.json');

exports.addToCart = (id, productPrice, result) => {
    fs.readFile(p, (err, fileContent) => {
        let cart = {products: [], totalPrice: 0};
        if(!err) {
            cart = JSON.parse(fileContent)
        }

        const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
        const existingProduct = cart.products[existingProductIndex];
        
        if(existingProduct) {
            cart.products[existingProductIndex].qty = cart.products[existingProductIndex].qty + 1;
        }
        else {
            cart.products.push({id: id, qty: 1});
        }
        
        cart.totalPrice = cart.totalPrice+Number.parseInt(productPrice);
        fs.writeFile(p, JSON.stringify(cart), err => {
            if(err) console.log(err);
            result(cart);
        });
    });

    //    result(cart);
}

exports.getCart = (result) => {
    fs.readFile(p, (err, fileContent) => {
        let cart = {products: [], totalPrice: 0}
        if(!err) {
            cart = JSON.parse(fileContent);
        }
        console.log(cart);
        result(cart);
    });
}





