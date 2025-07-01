const express = require("express");
const { check, body } = require('express-validator')
const routes = express.Router();
const authController = require("../controllers/auth")
const User = require("../models/user");


routes.get("/login", authController.getLogin);
routes.post("/login", authController.postLogin);

routes.post("/logout", authController.postLogout);

routes.get("/signup", authController.getSignUp);
routes.post("/signup", 
  [ 
    check('email').isEmail().withMessage('Please enter a valid email!')
    .custom((value, { req }) => {
      return User.findOne(value)
      .then(userDoc => {
        if (userDoc) {
           return Promise.reject('Email Already Exists')
        }
      })
    }),
    body('password', 'Please enter password with only numbers and text at least 5 characters.')
    .isLength({min: 5}),
    body('')
  ]
 , authController.postSignUp)

routes.get("/reset", authController.getReset);
routes.post("/reset", authController.postReset);

routes.get('/reset/:token', authController.getNewPassword);
routes.post('/new-password', authController.postNewPassword);

module.exports = routes;