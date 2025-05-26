const path = require("path");
const rootDir = require("../util/path");
const express = require("express");
const routes = express.Router();

const adminController = require('../controllers/admin');

routes.get("/add-product", adminController.getAddProducts);

routes.post("/add-product", adminController.postAddProducts);

routes.get("/products", adminController.getAdminProducts);

routes.get("/edit-product/:productId", adminController.getEditProducts);

routes.post("/edit-product", adminController.postEditProduct);

routes.post("/delete-product", adminController.postDeleteProduct);

module.exports = routes;

