/* POSTGRESQL 
const { Pool } = require("pg");

const pool = new Pool({
  host: 'localhost',
  user: "postgres",
  database: 'postgres',
  password: 'Bilal@1khan',
  port: 5432,
});

module.exports = pool;
*/

const Sequelize = require("sequelize");
const sequelize = new Sequelize('postgres', 'postgres', 'Bilal@1khan', {
  host: 'localhost',
  dialect: 'postgres'
})

module.exports = sequelize;
