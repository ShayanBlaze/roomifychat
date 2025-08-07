const express = require("express");
const router = express.Router();
const {
  createOrGetConversation,
  getUserConversations,
} = require("../controllers/conversationController");

router.route("/").post(createOrGetConversation).get(getUserConversations);

module.exports = router;
