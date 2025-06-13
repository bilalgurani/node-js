const bcrypt = require('bcryptjs');

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get("Cookie").split("=")[1] === "true";
  res.render("auth/login", {
    title: "Login page",
    docTitle: "Login",
    path: "/login",
    isAuthenticated: false
  });
}
exports.getSignUp = (req, res, next) => {
  res.render("auth/signup", {
    title: "Login page",
    docTitle: "Signup",
    path: "/signup",
    isAuthenticated: false
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne(email)
  .then(user => { 
    if (!user) {
      res.redirect("/login");
    }
    bcrypt.compare(password, user.password)
    .then(doMatch => {
      if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(() => {
            res.redirect("/");
        });
      }
      res.redirect("/login");
    }).catch(err => { 
      console.log(err);
      res.redirect("/login");
    });
  })
  .catch(err => console.log(err));
}

exports.postSignUp = (req, res, next) => {  
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
  .then(userDoc => {
    if (userDoc) {
      return res.redirect("/signup")
    }
    return bcrypt
    .hash(password, 12)
    .then(hashedPass => {
      const user = new User(name, email, hashedPass, {items: []})
      return user.save();
    })
    .then(result => {
      res.redirect("/login");
    });
  })
  
  
  .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/")
  });
}
