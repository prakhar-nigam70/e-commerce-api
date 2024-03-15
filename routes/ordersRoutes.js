const express = require("express");
const isLogin = require("../middlewares/isLogin");
const {
  createOrderCtrl,
  getOrdersCtrl,
  getOrderCtrl,
  updateOrderCtrl,
  getSalesStatsCtrl,
} = require("../controllers/ordersController");
const isAdmin = require("../middlewares/isAdmin");

const orderRouter = express.Router();

orderRouter.post("/", isLogin, createOrderCtrl);
orderRouter.get("/", isLogin, getOrdersCtrl);
orderRouter.get("/:id", isLogin, getOrderCtrl);
orderRouter.get("/sales/sum", isLogin, isAdmin, getSalesStatsCtrl);
orderRouter.put("/update/:id", isLogin, isAdmin, updateOrderCtrl);

module.exports = orderRouter;
