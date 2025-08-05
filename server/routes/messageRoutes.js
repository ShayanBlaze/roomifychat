const express = require("express");
const router = express.Router();
const { getGeneralMessages } = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.route("/general").get(getGeneralMessages);

module.exports = router;
