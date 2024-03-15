const asyncHandler = require("express-async-handler");
const Coupon = require("../models/Coupon");

// @desc    Create coupon
// @route   POST api/v1/coupons
// @access  Private/Admin

const createCouponCtrl = asyncHandler(async (req, res) => {
  // destructure code, startDate, endDate, discount
  const { code, startDate, endDate, discount } = req.body;
  //check if admin
  // check if coupon already exists
  const couponFound = await Coupon.findOne({ code });

  if (couponFound) throw new Error("Coupon code already exists");

  // check if discount is a number
  if (isNaN(discount)) throw new Error("Discount value must be a number");

  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });

  res.json({
    status: "success",
    message: "Coupon created successfully",
    data: coupon,
  });
});

// @desc    Get all coupons
// @route   GET api/v1/coupons
// @access  Public

const getAllCouponsCtrl = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();

  res.json({
    status: "success",
    message: "Coupons fetched successfully",
    data: coupons,
  });
});

// @desc    Get single coupon
// @route   GET api/v1/coupons/:id
// @access  Public

const getCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    throw new Error("Coupon not found");
  }
  res.json({
    status: "success",
    message: "Coupon fetched successfully!",
    data: coupon,
  });
});

// @desc    Update coupon
// @route   PUT api/v1/coupons/update/:id
// @access  Private/Admin

const updateCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      startDate,
      endDate,
      discount,
    },
    {
      new: true,
    }
  );

  res.json({
    status: "success",
    message: "Coupon updated successfully!",
    data: coupon,
  });
});

// @desc    Delete coupon
// @route   DELETE api/v1/coupons/delete/:id
// @access  Private/Admin

const deleteCouponCtrl = asyncHandler(async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);

  res.json({
    status: "success",
    message: "Coupon deleted successfully!",
  });
});

module.exports = {
  createCouponCtrl,
  getAllCouponsCtrl,
  getCouponCtrl,
  updateCouponCtrl,
  deleteCouponCtrl,
};
