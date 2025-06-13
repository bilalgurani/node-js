const Product = require('../models/product');
const mongodb = require("mongodb");

exports.getAddProducts = (req, res, next) => {
  const prodTitle = "Add Product";
  res.render("admin/edit-product", {
    title: prodTitle,
    docTitle: "Product page",
    path: "/admin/add-product",
    edit: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postAddProducts = async (req, res, next) => {      
  const {title, image_url: imageUrl, price, description } = req.body;
  const product = new Product(title, price, description, imageUrl, null, req.session.user._id);

  product.save()
  .then(() => { 
    res.redirect("/admin/products");
  }).catch(err => {
    console.log(err);
  })
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId; // get these from ejs file and in name tag
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.image_url;
  const updatedPrice = req.body.price;
  const updatedDes = req.body.description;

  const product = new Product(updatedTitle, updatedPrice, updatedDes, updatedImageUrl, 
    mongodb.ObjectId.createFromHexString(id));
  product.save()
  .then(res.redirect("/admin/products"))
  .catch(err => console.log(err));
};

exports.getEditProducts = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/")
  }
  const productId = req.params.productId;
  Product.findById(productId)
  .then((product) => {
    res.render("admin/edit-product", {
      title: "Update product",
      docTitle: "Edit page",
      path: "/admin/edit-product",
      edit: editMode,
      product: product,
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(error => {
    next(error);
  })
};

exports.getAdminProducts = async (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products", 
      path: "/admin/products",
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId)
  .then(() => {
    res.redirect("/admin/products");
  })
  .catch(err => console.log(err))
}