const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumber = Math.floor(1000 + Math.random() * 90000);

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        type: Object,
        required: true,
      },
    ],
    shippingAddress: {
      type: Object,
      required: true,
    },
    orderNumber: {
      type: String,
      default: randomTxt + randomNumber,
    },
    // for stripe payments
    paymentStatus: {
      type: String,
      default: "Not paid",
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    paymentMethod: {
      type: String,
      default: "Not specified",
    },
    currency: {
      type: String,
      default: "Not specified",
    },
    // for admin
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "shipped", "delivered"],
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
