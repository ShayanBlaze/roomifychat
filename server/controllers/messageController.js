const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    if (conversationId === "general") {
      const messages = await Message.find({ conversationId: "general" })
        .sort({ createdAt: 1 })
        .populate("sender", "name avatar")
        .populate({
          path: "replyTo",
          populate: {
            path: "sender",
            select: "name avatar",
          },
        });
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
      .populate("sender", "name avatar")
      .populate({
        path: "replyTo",
        populate: {
          path: "sender",
          select: "name avatar",
        },
      });

    res.json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    if (error.kind === "ObjectId" && req.params.conversationId !== "general") {
      return res.status(404).json({ message: "Conversation not found." });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    if (message.sender.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only edit your own messages." });
    }

    message.content = content;
    message.isEdited = true;
    const updatedMessage = await message.save();

    res.json(updatedMessage);
  } catch (error) {
    console.error("Failed to edit message:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    if (message.sender.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only delete your own messages." });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete message:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getConversationMessages,
  editMessage,
  deleteMessage,
};
