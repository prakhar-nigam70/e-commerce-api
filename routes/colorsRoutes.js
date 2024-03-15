const express = require("express");
const isLogin = require("../middlewares/isLogin");
const {
  createColorsCtrl,
  getAllColorsCtrl,
  getColorCtrl,
  updateColorCtrl,
  deleteColorsCtrl,
} = require("../controllers/colorsController");
const isAdmin = require("../middlewares/isAdmin");
const colorRouter = express.Router();

colorRouter.post("/", isLogin, isAdmin, createColorsCtrl);
colorRouter.get("/", getAllColorsCtrl);
colorRouter.get("/:id", getColorCtrl);
colorRouter.put("/:id", isLogin, isAdmin, updateColorCtrl);
colorRouter.delete("/:id", isLogin, isAdmin, deleteColorsCtrl);

module.exports = colorRouter;
