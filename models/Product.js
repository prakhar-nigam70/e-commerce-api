const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      ref: "Category",
      required: true,
    },
    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL"],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    totalQty: {
      type: Number,
      required: true,
    },
    totalSold: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

//Virtuals

// Total Qty Left:
productSchema.virtual("qtyLeft").get(function () {
  return this?.totalQty - this?.totalSold;
});

// Total Reviews:
productSchema.virtual("totalReviews").get(function () {
  return this?.reviews?.length;
});

// Average rating
productSchema.virtual("averageRating").get(function () {
  if (this?.reviews?.length === 0) return 0;
  let reviewsTotal = 0;
  this?.reviews?.forEach((review) => {
    reviewsTotal += review?.rating;
  });

  return Number(reviewsTotal / this?.reviews?.length).toFixed(1);
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
