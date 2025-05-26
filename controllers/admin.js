const Product = require('../models/products')

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
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const des = req.body.description;
  
  const product = new Product(null, title, imageUrl, price, des);
  
  product.save().then(() => {
    res.redirect("/");
  }).catch(error => {
    next(error);
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId; // get these from ejs file and in name tag
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const des = req.body.description;

  const updatedProduct = new Product(id, title, imageUrl, price, des);
  
  updatedProduct.save().then(() => {
    res.redirect("/admin/products");
  })
  .catch(error => {
    next(error);
  });
};

exports.getEditProducts = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect("/")
  }
  const productId = req.params.productId;
  Product.findById(productId)
  .then((product) => {
    console.log(product.rows[0]);
    
    res.render("admin/edit-product", {
      title: "Update product",
      docTitle: "Edit page",
      path: "/admin/edit-product",
      edit: editMode,
      product: product.rows[0]
    });
  })
  .catch(error => {
    next(error);
  })
};

exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();  
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products", 
      path: "/admin/products" 
    });
  } catch(error) {
    next(error);
  }
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId);
  res.redirect("/admin/products");
}