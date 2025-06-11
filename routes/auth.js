const express = require("express");
const routes = express.Router();
const authController = require("../controllers/auth")



routes.get("/login", authController.getLogin);
routes.post("/login", authController.postLogin);

module.exports = routes;