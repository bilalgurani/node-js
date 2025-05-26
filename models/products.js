const products = [];

const pool = require("../util/database")

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  async save() {
    return pool.query('INSERT INTO "shop"."products" ("title", "price", "description", "imageUrl") VALUES($1, $2, $3, $4)',
      [this.title, this.price, this.description, this.imageUrl]
    )
  }

  static deleteById(id) {
  
  }

  static async fetchAll() {
    try {
      const result = await pool.query("SELECT * FROM shop.products");
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