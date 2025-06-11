const express = require("express");
const routes = express.Router();
const authController = require("../controllers/auth")

routes.get("/login", authController.getLogin);
routes.post("/login", authController.postLogin);
routes.post("/logout", authController.postLogout);

module.exports = routes;