const Conversation = require("../models/Conversation");
const mongoose = require("mongoose");
const { onlineUsers } = require("../socket/socketHandler");

// @desc    Start or get a one-on-one conversation
// @route   POST /api/v1/conversations
// @access  Private
const createOrGetConversation = async (req, res) => {
  const { userId: otherUserId } = req.body;
  const currentUserId = req.user.id;

  if (!otherUserId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const participants = [
    new mongoose.Types.ObjectId(currentUserId),
    new mongoose.Types.ObjectId(otherUserId),
  ];

  try {
    let conversation = await Conversation.findOne({
      participants: { $all: participants },
    });

    if (conversation) {
      return res.status(200).json(conversation);
    }

    const newConversation = new Conversation({
      participants: participants,
    });

    newConversation.initializeUnreadCounts();

    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    console.error("Error in createOrGetConversation:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all conversations for the current user
// @route   GET /api/v1/conversations
// @access  Private
const getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id,
      lastMessage: { $ne: null },
    })
      .populate("participants", "name avatar isOnline lastSeen")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "name",
        },
      })
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    console.error("Error fetching user conversations:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get a conversation by ID
// @route   GET /api/v1/conversations/:id
// @access  Private
const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id).populate(
      "participants",
      "name avatar isOnline lastSeen"
    );

    if (!conversation)
      return res.status(404).json({ msg: "Conversation not found" });

    if (!conversation.participants.some((p) => p._id.equals(req.user.id))) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a conversation by ID
// @route   DELETE /api/v1/conversations/:id
// @access  Private
const deleteConversation = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const currentUserId = req.user.id;
    const io = req.app.get("socketio");

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found." });
    }

    if (
      !conversation.participants
        .map((id) => id.toString())
        .includes(currentUserId)
    ) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this conversation." });
    }

    const participants = conversation.participants;

    await conversation.deleteOne();

    participants.forEach((participantId) => {
      const participantSocketId = onlineUsers.get(participantId.toString());
      if (participantSocketId) {
        io.to(participantSocketId).emit("conversation_deleted", {
          conversationId,
        });
      }
    });

    res.status(200).json({ message: "Conversation deleted successfully." });
  } catch (error) {
    console.error("Error in deleteConversation:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createOrGetConversation,
  getUserConversations,
  getConversationById,
  deleteConversation,
};
