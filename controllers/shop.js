const products = [];
const Product = require('../models/products');
const Cart = require('../models/cart');
const path = require('../util/path');

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
  res.render("shop/index", {
    prods: products,
    docTitle: "Shop", 
    path: "/" 
  })
  } catch(error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All products ", 
      path: "/products" 
    });
  } catch(error) {
    next(error);
  }
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
  .then(product => {
    res.render("shop/product-details", {
      prods: product.rows[0], 
      path: "/products", 
      docTitle: product.rows[0].title
    })
  })
  .catch(error => {
    next(error);
  });
}

exports.getCart = (req, res, next) => {
  const cartProductList = [];
  Cart.getCartProducts(cart => {
    Product.fetchAll(products => {
      if (cart && cart.products.length > 0) {
        for (const product of products) {
          const cartProductData = cart.products.find(p => p.id === product.id);
          if (cartProductData) {
            cartProductList.push({
              productData: product,
              qty: cartProductData.qty
            });
          }
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        docTitle: "Your Cart",
        products: cartProductList
      });
    });
  });
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
  .then(product => {
    console.log(product.rows[0]);
    
    Cart.addProduct(productId, product.rows[0].price);
    res.redirect('/cart');
  })
  .catch(error => {
    next(error);
  });
}

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    docTitle: "Your Orders"
  })
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    docTitle: "Checkout"
  })
};

exports.postDeleteInCarts = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
  .then(product => {
    Cart.deleteProduct(productId, product.rows[0].price);
    res.redirect('/cart');
  })
  .catch(error => {
    next(error);
  });

}