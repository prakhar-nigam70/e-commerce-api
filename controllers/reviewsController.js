const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const Product = require("../models/Product");

// @desc    Create Review
// @route   GET api/v1/reviews/:productId
// @access  Private
const createReviewCtrl = asyncHandler(async (req, res) => {
  const { message, rating } = req.body;
  // Find the product with productId
  const { productId } = req.params;
  const foundProduct = await Product.findById(productId).populate("reviews");

  if (!foundProduct) {
    throw new Error("Product not found!");
  }

  // check if the user already has a review for the product
  //   const hasReviewed = foundProduct.reviews.find(
  //     (review) => review?.user?.toString() === req.userAuthId.toString()
  //   );
  //   if (hasReviewed) {
  //     throw new Error("You have already reviewed this product!");
  //   }
  // Create the review
  const review = await Review.create({
    message,
    rating,
    product: foundProduct._id,
    user: req.userAuthId,
  });

  // push the review in the product
  foundProduct.reviews.push(review._id);
  await foundProduct.save();

  // Send the response
  res.json({
    status: 201,
    message: "Review created successfully",
    data: review,
  });
});

module.exports = {
  createReviewCtrl,
};
