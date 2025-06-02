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
}, {schema: "shop"})

module.exports = User;

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