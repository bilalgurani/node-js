const Product = require('../models/product');

const ITEMS_PER_PAGE = 2;

exports.getIndex = async (req, res, next) => {
  const page = +req.query.page || 1;
  Promise.all([
    Product.fetchAll(page, ITEMS_PER_PAGE),
    Product.getTotalCount()
  ])
  .then(([products, totalProducts]) => {   
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

    let startPage, endPage;
    if (page <= 2) {
      // Show pages 1-5 when current page is 1, 2, or 3
      startPage = 1;
      endPage = Math.min(3, totalPages);
    } else if (page >= totalPages - 1) {
      // Show last 5 pages when near the end
      startPage = Math.max(1, totalPages - 2);
      endPage = totalPages;
    } else {
      // Show current page in middle with 2 on each side
      startPage = page - 1;
      endPage = page + 1;
    }

    res.render("shop/index", {
      prods: products,
      docTitle: "Shop", 
      path: "/",
      userName: req?.user?.name,
      currentPage: page,
      startPage: startPage,
      endPage: endPage,
      totalPages: totalPages,
      totalProducts: totalProducts
    })
  })
  .catch(err => console.log(err))
}

exports.getProducts = async (req, res, next) => {
  const page = +req.query.page || 1;
  Promise.all([
    Product.fetchAll(page, ITEMS_PER_PAGE),
    Product.getTotalCount()
  ])
  .then(([products, totalProducts]) => {
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All products ", 
      path: "/products",
      isAuthenticated: req.session.isLoggedIn,
      userName: req.user.name,
      currentPage: page,
      hasNextPage: hasNextPage,
      hasPreviousPage: hasPreviousPage,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: totalPages,
      totalPages: totalPages,
      totalProducts: totalProducts
    });
  })
  .catch(err => {
    console.log(err);
    next(err);
  })
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
}

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  
  Product.findById(productId)
  .then(product => {
    return req.user.addToCart(product);
  })
  .then(result => {
    res.redirect('/cart');
    console.log(result);
  })
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
  req.user.getCart()
  .then(products => {
    let total = 0;
    products.forEach(p => {     
      total += p.quantity * p.price;
    });
    res.render("shop/checkout", {
      path: "/checkout",
      docTitle: "Checkout page",
      products: products,
      isAuthenticated: req.session.isLoggedIn,
      userName: req.user.name,
      totalSum: total
    });
  })
  .catch(err => console.log(err))
};

exports.postDeleteInCarts = (req, res, next) => {
  const productId = req.body.productId;
  req.user.deleteItemFromCart(productId)
  .then(cart => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err));
}