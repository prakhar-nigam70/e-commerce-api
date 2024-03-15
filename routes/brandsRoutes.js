const express = require("express");
const isLogin = require("../middlewares/isLogin");
const {
  createBrandsCtrl,
  getAllBrandsCtrl,
  getBrandCtrl,
  updateBrandCtrl,
  deleteBrandsCtrl,
} = require("../controllers/brandsController");
const isAdmin = require("../middlewares/isAdmin");
const brandRouter = express.Router();

brandRouter.post("/", isLogin, isAdmin, createBrandsCtrl);
brandRouter.get("/", getAllBrandsCtrl);
brandRouter.get("/:id", getBrandCtrl);
brandRouter.put("/:id", isLogin, isAdmin, updateBrandCtrl);
brandRouter.delete("/:id", isLogin, isAdmin, deleteBrandsCtrl);

module.exports = brandRouter;
