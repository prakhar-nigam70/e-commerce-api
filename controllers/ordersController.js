const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

// @desc    Create Order
// @route   POST api/v1/orders
// @access  Private/Admin

const createOrderCtrl = asyncHandler(async (req, res) => {
  // get the coupon
  const { coupon } = req?.query;
  let discount = 0;

  const couponFound = await Coupon.findOne({
    code: coupon?.toUpperCase(),
  });

  if (coupon) {
    if (couponFound?.isExpired) {
      throw new Error("Coupon has expired!");
    }
    if (!couponFound) {
      throw new Error("Coupon does not exist");
    }

    discount = couponFound?.discount / 100;
  }

  // get the payload(user, orderItems, shippingAddress, totalPrice)
  const { orderItems, totalPrice } = req.body;

  // find the user
  const user = await User.findById(req.userAuthId);

  // check if the user has Shipping Address
  if (!user?.hasShippingAddress) {
    throw new Error("You don't have a shipping Address saved!");
  }
  const shippingAddress = user?.shippingAddress;

  // check if the order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("The order is empty, no order items!");
  }

  // Place/create the order - store in DB
  const order = await Order.create({
    orderItems,
    user: user._id,
    totalPrice: couponFound ? totalPrice * (1 - discount) : totalPrice,
    shippingAddress,
  });

  // push order into user
  user.orders.push(order?._id);
  await user.save();

  // Update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });
  orderItems.forEach(async (orderItem) => {
    const product = products.find(
      (product) => product?._id.toString() === orderItem?._id.toString()
    );
    if (product) {
      product.totalSold += orderItem?.qty;
    }
    await product.save();
  });

  // Make payments (stripe)
  const orderItemsPayload = orderItems.map((orderItem) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: orderItem?.name,
          description: orderItem?.description,
        },
        unit_amount: orderItem?.price * 100,
      },
      quantity: orderItem?.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: orderItemsPayload,
    metadata: {
      orderId: JSON.stringify(order._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success.html",
    cancel_url: "http://localhost:3000/success.html",
  });

  res.send({ url: session.url });

  // Return the response
  //   res.json({
  //     status: "success",
  //     message: "Order placed successfully!",
  //     data: order,
  //   });
});

// @desc    Get all orders
// @route   GET api/v1/orders
// @access  Private/Admin

const getOrdersCtrl = asyncHandler(async (req, res) => {
  const ordersQuery = Order.find();

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;
  const total = await Order.countDocuments();

  const pagination = {};

  if (startIdx > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  if (endIdx < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  const orders = await ordersQuery.skip(startIdx).limit(limit);

  res.json({
    status: "success",
    message: "Paginated orders fetched",
    total,
    pagination,
    results: orders.length,
    data: orders,
  });
});

// @desc    Get single order
// @route   GET api/v1/orders/:id
// @access  Private/Admin

const getOrderCtrl = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new Error("Order not found");
  }

  res.json({
    status: "success",
    message: "Order fetched successfully!",
    data: order,
  });
});

// @desc    Update order
// @route   PUT api/v1/orders/update/:id
// @access  Private/Admin

const updateOrderCtrl = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );

  res.json({
    status: "success",
    message: "Order updated successfully",
    data: updatedOrder,
  });
});

// @desc    Get sales sum
// @route   PUT api/v1/orders/sales/sum
// @access  Private/Admin

const getSalesStatsCtrl = asyncHandler(async (req, res) => {
  // get sales stats
  const salesStats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
        minimumOrderValue: {
          $min: "$totalPrice",
        },
        maximumOrderValue: {
          $max: "$totalPrice",
        },
        averageOrderValue: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);

  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const salesToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    message: "Fetched total sales",
    data: {
      all: salesStats,
      today: salesToday,
    },
  });
});

module.exports = {
  createOrderCtrl,
  getOrdersCtrl,
  getOrderCtrl,
  updateOrderCtrl,
  getSalesStatsCtrl,
};
