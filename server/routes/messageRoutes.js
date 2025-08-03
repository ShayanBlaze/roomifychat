const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Message = require("../models/Message");
const router = express.Router();

router.get("/:chatId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name avatar")
      .sort({ createdAt: "asc" });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
