const products = [];
const Product = require('../models/product');
const Cart = require('../models/cart');
const path = require('../util/path');

exports.getIndex = async (req, res, next) => {
  try {
    Product.findAll()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop", 
        path: "/" 
      })
    })
    .catch(err => console.log(err))
  } catch(error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All products ", 
      path: "/products" 
    });
  })
  .catch(err => console.log(err))
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByPk(productId)
  .then(product => {
    res.render("shop/product-details", {
      prods: product, 
      path: "/products", 
      docTitle: product.title
    })
  })
  .catch(error => {
    next(error);
  });
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(cart => {
    cart.getProducts()
    .then(products => {
      console.log("SDFSDFSDFDSFSDF");
    
      console.log(products);
      res.render("shop/cart", {
        path: "/cart",
        docTitle: "Your Cart",
        products: products 
      });
    })
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
  // const cartProductList = [];
  // Cart.getCartProducts(cart => {
  //   Product.fetchAll(products => {
  //     if (cart && cart.products.length > 0) {
  //       for (const product of products) {
  //         const cartProductData = cart.products.find(p => p.id === product.id);
  //         if (cartProductData) {
  //           cartProductList.push({
  //             productData: product,
  //             qty: cartProductData.qty
  //           });
  //         }
  //       }
  //     }
  //     res.render("shop/cart", {
  //       path: "/cart",
  //       docTitle: "Your Cart",
  //       products: cartProductList
  //     });
  //   });
  // });
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
  .then(cart => {
    fetchedCart = cart;
    return cart.getProducts({where: {id: productId}})
  })
  .then(products => {
    let product;
    if (products.length > 0) {
      product = products[0];
    }
    
    if (product) {
      //....
      const oldQty = product.cartItem.quantity;
      newQuantity = oldQty + 1;
      return product;
    }
    return Product.findByPk(productId)
    .catch(err => console.log(err))
  }).then(product => {
    return fetchedCart.addProduct(product, {through: {quantity: newQuantity} });
  })
  .then(() => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err)
  )
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
  req.user.getCart()
  .then(cart => {
    cart.getProducts()
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err));
}