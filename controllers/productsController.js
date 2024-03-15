const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Color = require("../models/Color");

// @desc    Create Product
// @route   POST api/v1/products
// @access  Private/Admin
const createProductCtrl = asyncHandler(async (req, res) => {
  const imagesPaths = req.files.map((file) => file.path);
  const {
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    price,
    totalQty,
    totalSold,
  } = req.body;

  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw Error("Product with this name exists already");
  }

  // find the brand
  const foundBrand = await Brand.findOne({
    name: brand.toLowerCase(),
  });

  if (!foundBrand) {
    throw new Error(
      "Brand not found. Please create the brand first, or check the brand name."
    );
  }

  // find the category
  const foundCategory = await Category.findOne({
    name: category.toLowerCase(),
  });

  if (!foundCategory) {
    throw new Error(
      "Category not found. Please create the category first, or check the category name."
    );
  }

  // find the category
  const foundColor = await Color.findOne({
    name: colors.toLowerCase(),
  });

  if (!foundColor) {
    throw new Error(
      "Color not found. Please create the color first, or check the color name."
    );
  }

  //create product
  const newProduct = await Product.create({
    name,
    description,
    brand: brand.toLowerCase(),
    category: category.toLowerCase(),
    sizes,
    colors: colors.toLowerCase(),
    price,
    totalQty,
    totalSold,
    images: imagesPaths,
    user: req.userAuthId,
  });

  //push product to category
  foundCategory.products.push(newProduct._id);
  await foundCategory.save();

  //push product to brand
  foundBrand.products.push(newProduct._id);
  await foundBrand.save();

  //push product to color
  foundColor.products.push(newProduct._id);
  await foundColor.save();

  //return response
  res.json({
    status: "success",
    message: "Product created successfully",
    data: newProduct,
  });
});

// @desc    Get All Products
// @route   POST api/v1/products
// @access  Public
const getProductsCtrl = asyncHandler(async (req, res) => {
  // database query
  let productsQuery = Product.find();

  // search by name
  if (req.query.name) {
    productsQuery = productsQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }
  // filter by brand
  if (req.query.brand) {
    productsQuery = productsQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }
  // filter by category
  if (req.query.category) {
    productsQuery = productsQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }
  // filter by colors
  if (req.query.colors) {
    productsQuery = productsQuery.find({
      colors: { $regex: req.query.colors, $options: "i" },
    });
  }
  // filter by sizes
  if (req.query.sizes) {
    productsQuery = productsQuery.find({
      sizes: { $regex: req.query.sizes, $options: "i" },
    });
  }

  // filter by priceRange
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    // greater than or equal to & less than or equal to
    productsQuery = productsQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  // pagination

  // page
  const page = parseInt(req.query.page) || 1;
  // limit
  const limit = parseInt(req.query.limit) || 10;
  // startIdx
  const startIdx = (page - 1) * limit;
  // endIdx
  const endIdx = page * limit;
  // total
  const total = await Product.countDocuments();

  const pagination = {};

  if (endIdx < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIdx > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // await the query
  const products = await productsQuery
    .skip(startIdx)
    .limit(limit)
    .populate("reviews");

  res.json({
    status: "success",
    message: "Fetched all Products",
    total,
    results: products.length,
    pagination,
    data: products,
  });
});

// @desc    Get Product
// @route   POST api/v1/products/:id
// @access  Public
const getProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("reviews");
  if (!product) {
    throw new Error("Product not found");
  }

  res.json({
    status: "success",
    message: "Product fetched successfully",
    data: product,
  });
});

// @desc    Update Product
// @route   PUT api/v1/products/:id
// @access  Private/Admin
const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    price,
    totalQty,
    totalSold,
  } = req.body;

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      brand,
      category,
      sizes,
      colors,
      price,
      totalQty,
      totalSold,
    },
    {
      new: true,
    }
  );

  res.json({
    status: "success",
    message: "Product updated successfully",
    data: product,
  });
});

// @desc    Delete Product
// @route   Delete api/v1/products/:id/delete
// @access  Private/Admin
const deleteProductCtrl = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  res.json({
    status: "success",
    message: "Product deleted successfully",
  });
});

module.exports = {
  createProductCtrl,
  getProductsCtrl,
  getProductCtrl,
  updateProductCtrl,
  deleteProductCtrl,
};
