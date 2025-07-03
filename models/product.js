const mongodb = require("mongodb");
const { ObjectId } = require('mongodb');
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    let dbOps;
    const db = getDb();
    if (this._id) {
      // Update product
      dbOps = db.collection("products")
      .updateOne({_id: this._id}, {$set: this });
    } else {
      dbOps = db.collection('products').insertOne(this);
    } 
    return dbOps
      .then(result => {
        console.log(result);
      })
      .catch(err => console.log(err))
  }

  static fetchAllByUserId(userId) {
    const db = getDb();
    return db.collection('products').find({userId: userId}).toArray()
    .then(products => {
      console.log(products);
      
      return products;
    })
    .catch(err => console.log(err))
  }

  static fetchAll(page, itemsPerPage) {
    const db = getDb();
    return db.collection('products').find()
    .skip((page - 1) * itemsPerPage)
    .limit(itemsPerPage)
    .toArray()
    .then(products => {
      return products;
    })
    .catch(err => console.log(err))
  }

  static getTotalCount() {
    const db = getDb();
    return db.collection('products')
    .countDocuments()
    .then(count => {      
      return count;
    })
    .catch(err => console.log(err))
  }

  static findById(id) {
    const db = getDb();
    return db.collection('products').find({_id: mongodb.ObjectId.createFromHexString(id)})
    .next()
    .then(products => {
      return products;  
    })
    .catch(err => console.log(err))
  }

  static deleteById(id, userId) {
    const db = getDb();
    return db.collection('products').deleteOne(
      {_id: mongodb.ObjectId.createFromHexString(id), userId: userId}
    )
    .then(res => {
      console.log("DELETED!"); 
    })
    .catch(err => console.log(err))
  }
}

/* 
const Sequelize = require("sequelize");
const sequelize = require("../util/database")

const Product = sequelize.define('products', 
  {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {schema: 'shop'}); */

module.exports = Product;


/* POSTGRESQL 
const pool = require("../util/database") 
module.exports = class Product {
  constructor(id, title, imageUrl, price, description, userId) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this.userId = userId;
  }

  async save() {
    return pool.query('INSERT INTO "shop"."products" ("title", "price", "description", "image_url", "user_id") VALUES($1, $2, $3, $4, $5)',
      [this.title, this.price, this.description, this.imageUrl]
    )
  }

  async update(id) {
    const query = `UPDATE "shop"."products" 
      SET title = $1, price = $2, description = $3, image_url = $4 
      WHERE id = $5`;
    return pool.query(query, [this.title, this.price, this.description, this.imageUrl, id])
  }

  static deleteById(id) {
    return pool.query('DELETE FROM "shop"."products" WHERE id = $1', [id]);
  }

  static async fetchAll() {
    try {
      const result = await pool.query('SELECT * FROM shop.products');  
      return result.rows;
    } catch(error) {
      console.error('Database error in fetchAll:', error);
      throw error; 
    }
 }

  static findById(id) {
    return pool.query("SELECT * FROM shop.products WHERE id = $1", [id]);
  }
}
*/
/* const products = [];

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    // It means we have already product and we're making the update
    if (this.id) {
      const existingProductIndex = products.findIndex(p => p.id === this.id);
      if (existingProductIndex !== -1) {
        products[existingProductIndex] = this;
      }
      
    } else {
      this.id = Math.random().toString();
      products.push(this);
    }
  }

  static deleteById(id) {
    const existingProductIndex =  products.findIndex(p => p.id === id);
    if (existingProductIndex !== -1) {
      products.splice(existingProductIndex, 1);
    }
  }

  static fetchAll(cb) {
    cb(products);
 }

  static findById(id, cb) {
    const product = products.find(p => p.id === id);
    cb(product);
  }
} */