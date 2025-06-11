const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// const User = require("./models/user");

const session = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: 'mongodb+srv://bilalahamedgurani:Bilal1khan@cluster0.btxkbsv.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0',
  collection: "sessions"
})

const errorController = require('./controllers/error');

const mongoConnect = require("./util/database").mongoConnect;

const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", (req, res, next) => {
  next();
});


app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {    
    req.user = new User(user.name, user.email, user.cart, user._id);
    next();
  })
  .catch(err => console.log(err));
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000); 
})

/* 
const Cart = require("./models/cart")
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");
const Product = require("./models/product");

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem })

sequelize
// .sync({ force: true })
.sync()
.then(result => {
  return User.findByPk(1);
})
.then(user => {
  if (!user) {
    return User.create({name: "Bilal", email: "bilalkhan@gmail.com"})
  }
  return user;
})
.then(user => {
  user.createCart();
})
.then(user => {
  app.listen(3000);
})

.catch(err => console.log(err)
)
 */

