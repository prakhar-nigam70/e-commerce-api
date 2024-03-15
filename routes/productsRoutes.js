const express = require("express");
const isLogin = require("../middlewares/isLogin");
const {
  createProductCtrl,
  getProductsCtrl,
  getProductCtrl,
  updateProductCtrl,
  deleteProductCtrl,
} = require("../controllers/productsController");
const upload = require("../config/fileUpload");
const isAdmin = require("../middlewares/isAdmin");
const productRouter = express.Router();

productRouter.post(
  "/",
  isLogin,
  isAdmin,
  upload.array("files"),
  createProductCtrl
);
productRouter.get("/", getProductsCtrl);
productRouter.get("/:id", getProductCtrl);
productRouter.put("/:id", isLogin, isAdmin, updateProductCtrl);
productRouter.delete("/:id/delete", isLogin, isAdmin, deleteProductCtrl);

module.exports = productRouter;
