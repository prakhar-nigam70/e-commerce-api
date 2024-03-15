const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Coupon is expired
couponSchema.virtual("isExpired").get(function () {
  return this.endDate < Date.now();
});

// Days left
couponSchema.virtual("daysLeft").get(function () {
  const daysLeft = Math.ceil(
    (this.endDate - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return daysLeft + " days left";
});

couponSchema.pre("validate", function (next) {
  if (this.endDate < this.startDate) {
    next(new Error("End date cannot be less than start date!"));
  }
  next();
});
couponSchema.pre("validate", function (next) {
  if (this.endDate < Date.now()) {
    next(new Error("End date cannot be less than today!"));
  }
  next();
});
couponSchema.pre("validate", function (next) {
  if (this.discount <= 0 || this.discount > 100) {
    next(
      new Error(
        "Discount should be greater than 0 and less than or equal to 100!"
      )
    );
  }
  next();
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
