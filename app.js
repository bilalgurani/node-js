const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const pool = require("./util/database")

const errorController = require('./controllers/error')

const app = express();

// async function getProducts() {
//   try {
//     const result = await pool.query('SELECT * FROM shop.products');
//     return result.rows;
//   } catch (error) {
//     console.error('Database error:', error);
//     throw error;
//   }
// }
// getProducts().then(p => {
//   console.log(p);
  
// })


app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", (req, res, next) => {
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);
