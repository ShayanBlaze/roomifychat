const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  registerUser,
  loginUser,
  getLoggedInUser,
} = require("../controllers/authController");

// @route   POST api/v1/auth/register
// @desc    Register a user
// @access  Public
router.post(
  "/register",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  registerUser
);

// @route POST api/v1/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  loginUser
);

// @route   POST api/v1/auth/logout
// @desc    Logout user
// @access  Private
router.post("/logout", (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Successfully logged out" });
});

// @route   GET api/v1/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", getLoggedInUser);

module.exports = router;
