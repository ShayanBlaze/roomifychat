const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    if (conversationId === "general") {
      const messages = await Message.find({ conversationId: "general" })
        .sort({ createdAt: 1 })
        .populate("sender", "name avatar");
      return res.json(messages);
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        message: "Forbidden: You are not a participant in this conversation.",
      });
    }

    const messages = await Message.find({ conversationId: conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "name avatar");

    res.json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    if (error.kind === "ObjectId" && req.params.conversationId !== "general") {
      return res.status(404).json({ message: "Conversation not found." });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getConversationMessages,
};
