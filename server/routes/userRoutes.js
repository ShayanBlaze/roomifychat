const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserById,
} = require("../controllers/userController");

router.route("/profile").get(getUserProfile).put(updateUserProfile);
router.route("/:id").get(getUserById);

module.exports = router;
