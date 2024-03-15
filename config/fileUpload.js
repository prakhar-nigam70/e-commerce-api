const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
  });
} catch (error) {
  console.log("Error configuring Cloudinary:", error);
  process.exit(1); // Exit the application on configuration error
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  allowedFormats: ["png", "jpg", "jpeg"],
  params: {
    folder: "e-commerce app",
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
