const Message = require("../models/Message");

// @desc    Get all messages for the general chat
// @route   GET /api/v1/messages/general
// @access  Private
const getGeneralMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: "general" })
      .sort({ createdAt: 1 })
      .populate("sender", "name avatar");

    res.json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getGeneralMessages,
};
