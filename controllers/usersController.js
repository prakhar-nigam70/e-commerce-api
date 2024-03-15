const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { findByIdAndUpdate } = require("../models/Product");

// @desc    Register user
// @route   POST api/v1/users/register
// @access  Private/Admin
const userRegisterCtrl = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  //check if the user already exists with this email
  const foundUser = await User.findOne({ email });
  // if exists throw an error
  if (foundUser) {
    throw new Error("User with email already exists!");
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //if not, create the user
  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });
  // return the user as response data
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: newUser,
  });
});

// @desc    Login user
// @route   POST api/v1/users/login
// @access  Private/Admin
const userLoginCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //find the user with the email
  const user = await User.findOne({ email });
  // if exists throw an error
  if (!user) {
    throw new Error("Username or password incorrect!");
  }

  //compare password
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Username or password incorrect!");
  }

  // return the user as response data
  res.status(201).json({
    status: "success",
    message: "User logged in successfully",
    data: user,
    token: generateToken(user?.id),
  });
});

// @desc    User Profile
// @route   GET api/v1/users/profile
// @access  Private
const userProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userAuthId).populate("orders");
  res.json({
    status: "success",
    message: "User profile fetched successfully",
    data: user,
  });
});

// @desc    Update user shipping address
// @route   PUT api/v1/users/update/shipping
// @access  Private
const updateShippingAddressCtrl = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    state,
    country,
    landmark,
    phone,
  } = req.body;

  const userUpdated = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        state,
        country,
        landmark,
        phone,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );

  res.json({
    status: "success",
    message: "Shipping Address updated successfully",
    data: userUpdated,
  });
});

module.exports = {
  userRegisterCtrl,
  userLoginCtrl,
  userProfileCtrl,
  updateShippingAddressCtrl,
};
