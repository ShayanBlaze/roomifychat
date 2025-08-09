const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getLoggedInUser,
} = require("../controllers/authController");

// @route   POST api/v1/auth/register
// @desc    Register a user
// @access  Public
router.post("/register", registerUser);

// @route POST api/v1/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", loginUser);

// @route   GET api/v1/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", getLoggedInUser);

module.exports = router;
