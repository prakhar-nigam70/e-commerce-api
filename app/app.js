const express = require("express");
const dbConnect = require("../config/dbConnect");
const {
  globalErrorHandler,
  routeNotFound,
} = require("../middlewares/errorHandlers");
const userRouter = require("../routes/usersRoutes");
const productRouter = require("../routes/productsRoutes");
const categoryRouter = require("../routes/categoryRoutes");
const brandRouter = require("../routes/brandsRoutes");
const colorRouter = require("../routes/colorsRoutes");
const reviewRouter = require("../routes/reviewsRoutes");
const orderRouter = require("../routes/ordersRoutes");
const stripeWebhookCtrl = require("../controllers/stripeWebhookController");
const couponRouter = require("../routes/couponRoutes");
require("dotenv").config();
dbConnect();
const app = express();

//stripe webhook
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookCtrl
);

app.use(express.json());

//user Routes
app.use("/api/v1/users", userRouter);

//product Routes
app.use("/api/v1/products", productRouter);

//category Routes
app.use("/api/v1/categories", categoryRouter);

//brand Routes
app.use("/api/v1/brands", brandRouter);

//color Routes
app.use("/api/v1/colors", colorRouter);

//review Routes
app.use("/api/v1/reviews", reviewRouter);

//order Routes
app.use("/api/v1/orders", orderRouter);

//coupon Routes
app.use("/api/v1/coupons", couponRouter);

app.use(routeNotFound);
app.use(globalErrorHandler);

module.exports = app;
