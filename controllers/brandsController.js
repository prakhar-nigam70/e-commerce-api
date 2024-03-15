const asyncHandler = require("express-async-handler");
const Brand = require("../models/Brand");

// @desc    Create Brand
// @route   POST api/v1/brands
// @access  Private/Admin
const createBrandsCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const foundBrand = await Brand.findOne({ name });

  if (foundBrand) {
    throw new Error("Brand exists already!");
  }

  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.status(201).json({
    status: "success",
    message: "Brand created successfully",
    data: brand,
  });
});

// @desc    Get All Brands
// @route   GET api/v1/brands
// @access  Public
const getAllBrandsCtrl = asyncHandler(async (req, res) => {
  const brands = await Brand.find();

  res.json({
    status: "success",
    message: "Brands fetched successfully!",
    data: brands,
  });
});

// @desc    Get Brand
// @route   GET api/v1/brands/:id
// @access  Public
const getBrandCtrl = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    throw new Error("Brand not found");
  }
  res.json({
    status: "success",
    message: "Brand fetched successfully!",
    data: brand,
  });
});

// @desc    Update Brand
// @route   PUT api/v1/brands/:id
// @access  Public
const updateBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const brand = await Brand.findByIdAndUpdate(
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
    message: "Brand updated successfully",
    data: brand,
  });
});

// @desc    Delete Brand
// @route   Delete api/v1/brands/:id
// @access  Private/Admin
const deleteBrandsCtrl = asyncHandler(async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id);

  res.json({
    status: "success",
    message: "Brand deleted successfully",
  });
});

module.exports = {
  createBrandsCtrl,
  getAllBrandsCtrl,
  getBrandCtrl,
  updateBrandCtrl,
  deleteBrandsCtrl,
};
