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
exports.postLogin = (req, res, next) => {
  User.findById("6848290f87899ac7cf38b641")
  .then(user => {    
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save(() => {
      res.redirect("/");
    });
  })
  .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/")
  });
}
