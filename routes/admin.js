const path = require("path");
const rootDir = require("../util/path");
const express = require("express");
const routes = express.Router();
const isAuth = require("../middleware/is-auth")

const adminController = require('../controllers/admin');

routes.get("/add-product", isAuth, adminController.getAddProducts);

routes.post("/add-product", isAuth, adminController.postAddProducts);

routes.get("/products", isAuth, adminController.getAdminProducts);

routes.get("/edit-product/:productId", isAuth, adminController.getEditProducts);

routes.post("/edit-product", isAuth, adminController.postEditProduct);

routes.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = routes;

