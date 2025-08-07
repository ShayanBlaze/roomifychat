const express = require("express");
const router = express.Router();
const { getConversationMessages } = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.route("/:conversationId").get(getConversationMessages);

module.exports = router;
