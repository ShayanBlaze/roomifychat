const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

router.route("/profile").get(getUserProfile).put(updateUserProfile);

module.exports = router;
