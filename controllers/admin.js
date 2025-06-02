const Product = require('../models/product')

exports.getAddProducts = (req, res, next) => {
  const prodTitle = "Add Product";
  res.render("admin/edit-product", {
    title: prodTitle,
    docTitle: "Product page",
    path: "/admin/add-product",
    edit: false,
  });
};

exports.postAddProducts = async (req, res, next) => {    
  const {title, image_url: imageUrl, price, description } = req.body;
  
  req.user.createProduct({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl
  }).then(() => { 
    res.redirect("/");
  }).catch(err => {
    console.log(err);
  })
  // req.user.createProduct({
  //   title,
  //   imageUrl,
  //   price,
  //   description
  // })
  // .then(() => {
  //   res.redirect("/");
  // }).catch(err => console.log(err))
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId; // get these from ejs file and in name tag
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.image_url;
  const updatedPrice = req.body.price;
  const updatedDes = req.body.description;

  Product.findByPk(id)
  .then(product => {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDes;
    product.imageUrl = updatedImageUrl;
    return product.save();
  })
  .then(() => {
    res.redirect("/admin/products");
  })
  .catch(err => console.log(err))
};

exports.getEditProducts = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/")
  }
  const productId = req.params.productId;
  req.user.getProducts()
  .then((products) => {
    res.render("admin/edit-product", {
      title: "Update product",
      docTitle: "Edit page",
      path: "/admin/edit-product",
      edit: editMode,
      product: products[0]
    });
  })
  .catch(error => {
    next(error);
  })
};

exports.getAdminProducts = async (req, res, next) => {
  req.user.getProducts()
  .then(products => {
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products", 
      path: "/admin/products" 
    });
  })
  .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByPk(productId)
  .then(product => {
    return product.destroy();
  })
  .then(() => {
    res.redirect("/admin/products");
  })
  .catch(err => console.log(err))
  
}