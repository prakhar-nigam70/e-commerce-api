const express = require("express");
const isLogin = require("../middlewares/isLogin");
const { createReviewCtrl } = require("../controllers/reviewsController");
const reviewRouter = express.Router();

reviewRouter.post("/:productId", isLogin, createReviewCtrl);

module.exports = reviewRouter;
