const express = require("express");
const routes = express.Router();
const authController = require("../controllers/auth")

routes.get("/login", authController.getLogin);
routes.post("/login", authController.postLogin);

routes.post("/logout", authController.postLogout);

routes.get("/signup", authController.getSignUp);
routes.post("/signup", authController.postSignUp)

routes.get("/reset", authController.getReset);
routes.post("/reset", authController.postReset);

routes.get('/reset/:token', authController.getNewPassword);
routes.post('/new-password', authController.postNewPassword);

module.exports = routes;