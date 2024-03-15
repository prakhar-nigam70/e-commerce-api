const express = require("express");
const {
  userRegisterCtrl,
  userLoginCtrl,
  userProfileCtrl,
  updateShippingAddressCtrl,
} = require("../controllers/usersController");
const isLogin = require("../middlewares/isLogin");
const userRouter = express.Router();

userRouter.post("/register", userRegisterCtrl);
userRouter.post("/login", userLoginCtrl);
userRouter.get("/profile", isLogin, userProfileCtrl);
userRouter.put("/update/shipping", isLogin, updateShippingAddressCtrl);

module.exports = userRouter;
