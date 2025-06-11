const express = require("express");

const shopController = require('../controllers/shop')

const routes = express.Router();

routes.get("/", shopController.getIndex);

routes.get("/products", shopController.getProducts);

routes.get("/products/:productId", shopController.getProduct);

routes.get("/cart", shopController.getCart);

routes.post("/cart", shopController.postCart);

routes.get("/orders", shopController.getOrders);

routes.post("/create-order", shopController.postOrder);

// routes.get("/checkout", shopController.getCheckout);

routes.post("/cart-delete-item", shopController.postDeleteInCarts)


module.exports = routes;
