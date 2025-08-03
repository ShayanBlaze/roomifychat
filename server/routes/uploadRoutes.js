const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/uploadController");

const {
  uploadAvatar,
  uploadChatImage,
} = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/avatar",
  authMiddleware,
  uploadAvatar.single("file"),
  uploadImage
);

router.post(
  "/chat-image",
  authMiddleware,
  uploadChatImage.single("file"),
  uploadImage
);

module.exports = router;
