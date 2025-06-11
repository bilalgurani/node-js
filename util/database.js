// Using MongoDB
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callBack) => {
  MongoClient.connect("mongodb+srv://bilalahamedgurani:Bilal1khan@cluster0.btxkbsv.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0")
  .then(client => {
    console.log("Connected!");
    _db = client.db();
    callBack(client);
  })
  .catch(err => {
    console.log(err);
    throw err;
  })
}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database connection!";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

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

// Using Sequlize
/* const Sequelize = require("sequelize");
const sequelize = new Sequelize('postgres', 'postgres', 'Bilal@1khan', {
  host: 'localhost',
  dialect: 'postgres'
})

module.exports = sequelize; */
