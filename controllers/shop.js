const Product = require('../models/product');

exports.getIndex = async (req, res, next) => {    
  Product.fetchAll()
  .then(products => {
    res.render("shop/index", {
      prods: products,
      docTitle: "Shop", 
      path: "/",
      userName: req?.user?.name
    })
  })
  .catch(err => console.log(err))
}

exports.getProducts = async (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All products ", 
      path: "/products",
      isAuthenticated: req.session.isLoggedIn,
      userName: req.user.name
    });
  })
  .catch(err => console.log(err))
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
  .then(product => {
    res.render("shop/product-details", {
      prods: product, 
      path: "/products", 
      docTitle: product.title,
      isAuthenticated: req.session.isLoggedIn,
      userName: req.user.name
    })
  })
  .catch(error => {
    next(error);
  });
}

exports.getCart = (req, res, next) => {
  console.log("req: ");
  
  console.log(req.user);
  
  req.user.getCart()
  .then(products => {
    res.render("shop/cart", {
      path: "/cart",
      docTitle: "Your Cart",
      products: products,
      isAuthenticated: req.session.isLoggedIn,
      userName: req.user.name
    });
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
  
  Product.findById(productId)
  .then(product => {
    console.log("REQ.USER: ");
    
    console.log(req.user);
    
    return req.user.addToCart(product);
  })
  .then(result => {
    res.redirect('/cart');
    console.log(result);
  })

  /* 
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
  ) */
}

exports.postOrder = (req, res, next) => {
  req.user.addOrder()
  .then(result => {
    res.redirect("/orders")
  })
  .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders()
  .then(orders => {
    res.render("shop/orders", {
      path: "/orders",
      docTitle: "Your Orders",
      orders: orders,
      isAuthenticated: req.session.isLoggedIn,
      userName: req.user.name
    })
  })
  .catch(err => console.log(err))
  
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    docTitle: "Checkout"
  })
};

exports.postDeleteInCarts = (req, res, next) => {
  const productId = req.body.productId;
  req.user.deleteItemFromCart(productId)
  .then(cart => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
}