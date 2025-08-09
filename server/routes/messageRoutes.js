const express = require("express");
const router = express.Router();
const { getConversationMessages } = require("../controllers/messageController");

router.route("/:conversationId").get(getConversationMessages);

module.exports = router;
