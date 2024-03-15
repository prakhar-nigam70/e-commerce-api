const express = require("express");
const isLogin = require("../middlewares/isLogin");
const {
  createCouponCtrl,
  getAllCouponsCtrl,
  getCouponCtrl,
  updateCouponCtrl,
  deleteCouponCtrl,
} = require("../controllers/couponsController");
const isAdmin = require("../middlewares/isAdmin");
const couponRouter = express.Router();

couponRouter.post("/", isLogin, isAdmin, createCouponCtrl);
couponRouter.get("/", getAllCouponsCtrl);
couponRouter.get("/:id", getCouponCtrl);
couponRouter.put("/update/:id", isLogin, isAdmin, updateCouponCtrl);
couponRouter.delete("/delete/:id", isLogin, isAdmin, deleteCouponCtrl);

module.exports = couponRouter;
