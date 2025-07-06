const { ValidationError } = require('sequelize');
const Product = require('../models/product');
const mongodb = require("mongodb");

const ITEMS_PER_PAGE = 2;

exports.getAddProducts = (req, res, next) => {
  const prodTitle = "Add Product";
  res.render("admin/edit-product", {
    title: prodTitle,
    docTitle: "Product page",
    path: "/admin/add-product",
    edit: false,
    isAuthenticated: req.session.isLoggedIn,
    userName: req.user?.name,
    oldInput: {
      title: '',
      price: '',
      description: ''
    },
    errorTitle: [],
    errorMessage: [],
    ValidationError: []
  });
};

exports.postAddProducts = async (req, res, next) => {      
  // const {title, image_url: imageUrl, price, description } = req.body;
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;

  const imageUrl = image.path;

  // const {title, image: imageUrl, price, description } = req.body;
  const product = new Product(title, price, description, imageUrl, null, req.session.user._id);
  if (!image) {
    return res.status(422).render("admin/edit-product", {
      title: prodTitle,
      docTitle: "Product page",
      path: "/admin/add-product",
      edit: false,
      isAuthenticated: req.session.isLoggedIn,
      userName: req.user?.name,
      oldInput: {
        title: title,
        price: price,
        description: description
      },
      errorTitle: ['Invalid file'],
      errorMessage: ['Please upload only png/jpg/jpeg.'],
      ValidationError: []
    });
  }
  
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
  const image = req.file;
  const updatedPrice = req.body.price;
  const updatedDes = req.body.description;

  let updatedImageUrl;
  if (image) {
    updatedImageUrl = image.path;
  }
  Product.findById(id)
  .then(prod => {
    
    if (prod.userId.toString() !== req.user._id.toString()) {      
      return res.redirect('/')
    }
    const product = new Product(updatedTitle, updatedPrice, updatedDes, updatedImageUrl, 
      mongodb.ObjectId.createFromHexString(id), req.user._id);      
    return product.save()
    .then(res.redirect("/admin/products"))
  })
  
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
      isAuthenticated: req.session.isLoggedIn,
      userName: req.user?.name,
      oldInput: {
        title: '',
        price: '',
        description: ''
      },
      errorTitle: [],
      errorMessage: [],
      ValidationError: []
    });
  })
  .catch(error => {
    next(error);
  })
};

exports.getAdminProducts = async (req, res, next) => {  
  const page = +req.query.page || 1;
  Promise.all([
    Product.fetchAllByUserId(req.user._id, page, ITEMS_PER_PAGE),
    Product.getTotalCount()
  ])
  .then(([products, totalProducts]) => {   
    const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products", 
      path: "/admin/products",
      userName: req?.user?.name,
      currentPage: page,
      hasNextPage: hasNextPage,
      hasPreviousPage: hasPreviousPage,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: totalPages,
      totalPages: totalPages,
      totalProducts: totalProducts
    })
  })
  .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId, req.user._id)
  .then(() => {
    res.redirect("/admin/products");
  })
  .catch(err => console.log(err))
}