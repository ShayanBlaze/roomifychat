const express = require("express");
const router = express.Router();
const {
  getConversationMessages,
  editMessage,
  deleteMessage,
} = require("../controllers/messageController");

router.get("/:conversationId", getConversationMessages);

router.route("/:messageId").patch(editMessage).delete(deleteMessage);

module.exports = router;
