const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({productId: new mongodb.ObjectId(product._id), quantity: newQuantity})
    }

    const updatedCart = {
      items: updatedCartItems
    };

    const db = getDb();
    return db.collection("users").updateOne(
      {_id: new mongodb.ObjectId(this._id)},
      { $set: { cart: updatedCart }}
    );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    return db.collection('products').find({_id: {$in: productIds}})
    .toArray()
    .then(products => {
      return products.map(p => {
        return {
          ...p,
          quantity: this.cart.items.find(i => {
            return i.productId.toString() === p._id.toString();
          }).quantity
        }
      });
    });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString(); 
    })
    const db = getDb();
    return db.collection('users').updateOne(
      {_id: new mongodb.ObjectId(this._id)},
      { $set: { cart: {items: updatedCartItems } }}
    );
  }

  addOrder() {
    const db = getDb();
    return this.getCart().then(products => {
      const order = {
        items: products,
        user: {
          _id: new mongodb.ObjectId(this._id),
          name: this.name 
        }
      };
      return db
      .collection('orders')
      .insertOne(order)
    })
    .then(order => {
      this.cart = {items: []};
      return db
      .collection('users')
      .updateOne(
        {_id: new mongodb.ObjectId(this._id)},
        { $set: { cart: {items: [] } }}
      );
    });
  }

  getOrders() {
    const db = getDb();
    return db
    .collection('orders')
    .find({ 'user._id' : new mongodb.ObjectId(this._id)})
    .toArray();
  }

  static findById(id) {
    const db = getDb();
    return db.collection('users').findOne({_id: mongodb.ObjectId.createFromHexString(id)})
    .then(user => {
      return user;
    })
    .catch(err => console.log(err));
  }
}

module.exports = User;

/* 
const Sequelize = require("sequelize");
const sequelize = require("../util/database")
const User = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
}, {schema: "shop"}) */



/*

const pool = require("../util/database") 
module.exports = class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  async createProduct(productData) {
    try {
      const { title, imageUrl, price, description } = productData;
      const result = await pool.query(
        'INSERT INTO "shop"."products" ("title", "price", "description", "image_url", "user_id") VALUES($1, $2, $3, $4, $5)',
        [title, price, description, imageUrl, this.id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const result = await pool.query('SELECT * FROM shop.users WHERE id = $1', [id]);
  
      if (result.rows.length === 0) return null;
      
      const userData = result.rows[0];
      return new User(userData.id, userData.name, userData.email);
      
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }
  
}
*/