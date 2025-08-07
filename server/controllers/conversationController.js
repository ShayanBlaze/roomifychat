const Conversation = require("../models/Conversation");
const mongoose = require("mongoose");

// @desc    Start or get a one-on-one conversation
// @route   POST /api/v1/conversations
// @access  Private
const createOrGetConversation = async (req, res) => {
  const { userId: otherUserId } = req.body;
  const currentUserId = req.user.id;

  if (!otherUserId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  // Convert string IDs to mongoose ObjectIDs for consistent comparison
  const participants = [
    mongoose.Types.ObjectId(currentUserId),
    mongoose.Types.ObjectId(otherUserId),
  ];

  try {
    // Find if a conversation already exists with these two participants
    let conversation = await Conversation.findOne({
      participants: { $all: participants },
    });

    // If conversation exists, return it
    if (conversation) {
      return res.status(200).json(conversation);
    }

    // If not, create a new one
    const newConversation = new Conversation({
      participants: participants,
    });

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
    })
      .populate("participants", "name avatar")
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

module.exports = {
  createOrGetConversation,
  getUserConversations,
};
