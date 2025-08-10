const express = require("express");
const router = express.Router();
const {
  createOrGetConversation,
  getUserConversations,
  getConversationById,
  deleteConversation,
} = require("../controllers/conversationController");

router.route("/").post(createOrGetConversation).get(getUserConversations);
router.route("/:id").get(getConversationById).delete(deleteConversation);

module.exports = router;
