const asyncHandler = require("express-async-handler");
const Color = require("../models/Color");

// @desc    Create Color
// @route   POST api/v1/colors
// @access  Private/Admin
const createColorsCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const foundColor = await Color.findOne({ name });

  if (foundColor) {
    throw new Error("Color exists already!");
  }

  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.status(201).json({
    status: "success",
    message: "Color created successfully",
    data: color,
  });
});

// @desc    Get All Colors
// @route   GET api/v1/colors
// @access  Public
const getAllColorsCtrl = asyncHandler(async (req, res) => {
  const colors = await Color.find();

  res.json({
    status: "success",
    message: "Colors fetched successfully!",
    data: colors,
  });
});

// @desc    Get Color
// @route   GET api/v1/colors/:id
// @access  Public
const getColorCtrl = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  if (!color) {
    throw new Error("Color not found");
  }
  res.json({
    status: "success",
    message: "Color fetched successfully!",
    data: color,
  });
});

// @desc    Update Color
// @route   PUT api/v1/colors/:id
// @access  Public
const updateColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const color = await Color.findByIdAndUpdate(
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
    message: "Color updated successfully",
    data: color,
  });
});

// @desc    Delete Color
// @route   Delete api/v1/colors/:id
// @access  Private/Admin
const deleteColorsCtrl = asyncHandler(async (req, res) => {
  await Color.findByIdAndDelete(req.params.id);

  res.json({
    status: "success",
    message: "Color deleted successfully",
  });
});

module.exports = {
  createColorsCtrl,
  getAllColorsCtrl,
  getColorCtrl,
  updateColorCtrl,
  deleteColorsCtrl,
};
