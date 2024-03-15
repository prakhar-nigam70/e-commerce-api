const express = require("express");
const isLogin = require("../middlewares/isLogin");
const {
  createCategoriesCtrl,
  getAllCategoriesCtrl,
  getCategoryCtrl,
  updateCategoryCtrl,
  deleteCategoriesCtrl,
} = require("../controllers/categoriesController");
const upload = require("../config/fileUpload");
const isAdmin = require("../middlewares/isAdmin");
const categoryRouter = express.Router();

categoryRouter.post(
  "/",
  isLogin,
  isAdmin,
  upload.single("file"),
  createCategoriesCtrl
);
categoryRouter.get("/", getAllCategoriesCtrl);
categoryRouter.get("/:id", getCategoryCtrl);
categoryRouter.put("/:id", isLogin, isAdmin, updateCategoryCtrl);
categoryRouter.delete("/:id", isLogin, isAdmin, deleteCategoriesCtrl);

module.exports = categoryRouter;
