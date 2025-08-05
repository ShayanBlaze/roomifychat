const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/uploadController");
const {
  uploadAvatar,
  uploadChatImage,
} = require("../middleware/uploadMiddleware");

router.post("/avatar", uploadAvatar.single("file"), uploadImage);
router.post("/chat-image", uploadChatImage.single("file"), uploadImage);

module.exports = router;
