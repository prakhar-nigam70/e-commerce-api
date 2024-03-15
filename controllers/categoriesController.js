const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");

// @desc    Create Category
// @route   POST api/v1/categories
// @access  Private/Admin
const createCategoriesCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const foundCategory = await Category.findOne({ name });

  if (foundCategory) {
    throw new Error("Category exists already!");
  }

  const category = await Category.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
    image: req.file.path,
  });

  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    data: category,
  });
});

// @desc    Get All Categories
// @route   GET api/v1/categories
// @access  Public
const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.json({
    status: "success",
    message: "Categories fetched successfully!",
    data: categories,
  });
});

// @desc    Get Category
// @route   GET api/v1/categories/:id
// @access  Public
const getCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new Error("Category not found");
  }
  res.json({
    status: "success",
    message: "Category fetched successfully!",
    data: category,
  });
});

// @desc    Update Category
// @route   PUT api/v1/categories/:id
// @access  Public
const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    {
      new: true,
    }
  );

  res.json({
    status: "success",
    message: "Category updated successfully",
    data: category,
  });
});

// @desc    Delete Category
// @route   Delete api/v1/categories/:id
// @access  Private/Admin
const deleteCategoriesCtrl = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);

  res.json({
    status: "success",
    message: "Category deleted successfully",
  });
});

module.exports = {
  createCategoriesCtrl,
  getAllCategoriesCtrl,
  getCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoriesCtrl,
};
