const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

router.use(authMiddleware);

router.route("/profile").get(getUserProfile).put(updateUserProfile);

module.exports = router;