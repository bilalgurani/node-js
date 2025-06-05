const Sequelize = require("sequelize");
const sequelize = require("../util/database")

const Order = sequelize.define("order", {
  id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
}, {schema: "shop"});

module.exports = Order;