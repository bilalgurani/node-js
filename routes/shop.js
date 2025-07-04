const express = require("express");
const shopController = require('../controllers/shop')
const routes = express.Router();
const isAuth = require("../middleware/is-auth")

routes.get("/", shopController.getIndex);

routes.get("/products", shopController.getProducts);

routes.get("/products/:productId", shopController.getProduct);

routes.get("/cart", isAuth, shopController.getCart);

routes.post("/cart", isAuth, shopController.postCart);

routes.get("/orders", isAuth, shopController.getOrders);

routes.post("/create-order", isAuth, shopController.postOrder);

routes.post("/cart-delete-item", isAuth, shopController.postDeleteInCarts);

routes.get("/checkout", isAuth, shopController.getCheckout);


module.exports = routes;
