const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const flash = require('connect-flash');

const session = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const store = new MongoDBStore({
  uri: 'mongodb+srv://bilalahamedgurani:Bilal1khan@cluster0.btxkbsv.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0',
  collection: "sessions"
})

const errorController = require('./controllers/error');

const mongoConnect = require("./util/database").mongoConnect;

const csrfProtection = csrf();

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
    req.user = new User(user.name, user.email, user.password, undefined, undefined, user.cart, user._id);
    next();
  })
  .catch(err => console.log(err));
})

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000); 
})

