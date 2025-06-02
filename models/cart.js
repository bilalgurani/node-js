const Sequelize = require("sequelize");
const sequelize = require("../util/database")

const Cart = sequelize.define("cart", {
  id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
}, {schema: "shop"});

module.exports = Cart;

/* 
const Product = require("./product")
let cart = { products: [], totalPrice: 0 };
module.exports = class Cart {
  static addProduct(id, productPrice) {
    // fetch the previous cart
    // find the existing product
    // Add new product / increase quantity
    Product.findById(id)
  .then(product => {
    if (!product.rows[0]) {
      return;
    }
    
  })
  .catch(error => {
    next(error);
  });
    const existingProductIndex = cart.products.findIndex(prod => prod.id == id);
    const existingProduct = cart.products[existingProductIndex];

    if (existingProduct) {
      existingProduct.qty = existingProduct.qty + 1;
    } else {
      cart.products.push({id: id, qty: 1});
    }
    cart.totalPrice = cart.totalPrice + +productPrice;
  }
  
  static deleteProduct(id, productPrice) {
    const updatedCart = {...cart};
    const product = updatedCart.products.find(p => p.id === id);
    const productQty = product.qty;
    updatedCart.products = updatedCart.products.filter(p => p.id !== id);
    updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
    cart = {...updatedCart};
  }

  static getCartProducts(cb) {
    if (cart && cart.products.length > 0) {
      cb(cart);
    } else {
      cb(null);    
  }
}
}
*/