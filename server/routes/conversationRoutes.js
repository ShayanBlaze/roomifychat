const express = require("express");
const router = express.Router();
const {
  createOrGetConversation,
  getUserConversations,
  getConversationById,
} = require("../controllers/conversationController");

router.route("/").post(createOrGetConversation).get(getUserConversations);
router.route("/:id").get(getConversationById);

module.exports = router;
