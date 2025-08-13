const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const User = require("../models/User");
const Conversation = require("../models/Conversation");

let onlineUsers = new Map();

const initializeSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: Token not provided."));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error: Invalid token."));
      }
      socket.user = decoded;
      next();
    });
  });

  io.on("connection", async (socket) => {
    console.log(
      "A user connected:",
      socket.id,
      "with User ID:",
      socket.user.id
    );

    onlineUsers.set(socket.user.id, socket.id);

    try {
      await User.findByIdAndUpdate(socket.user.id, { isOnline: true });
    } catch (err) {
      console.error("Error updating user status:", err);
    }

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    socket.join("general");
    console.log(`User ${socket.id} joined the general room`);

    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);

      try {
        await User.findByIdAndUpdate(socket.user.id, {
          isOnline: false,
          lastSeen: new Date(),
        });
      } catch (err) {
        console.error("Error updating user to offline", err);
      }

      onlineUsers.delete(socket.user.id);

      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { content, type, tempId, conversationId, replyTo } = data;
        const senderId = socket.user.id;

        const message = new Message({
          content,
          type,
          sender: senderId,
          conversationId,
          replyTo: replyTo || null,
        });
        const savedMessage = await message.save();

        const populatedMessage = await Message.findById(savedMessage._id)
          .populate("sender", "name _id avatar")
          .populate({
            path: "replyTo",
            populate: {
              path: "sender",
              select: "name",
            },
          });

        const finalMessage = populatedMessage.toObject();
        finalMessage.tempId = tempId;

        io.to(conversationId).emit("newMessage", finalMessage);

        const updatedConversation = await Conversation.findByIdAndUpdate(
          conversationId,
          { lastMessage: savedMessage._id },
          { new: true }
        )
          .populate("participants", "name avatar isOnline lastSeen")
          .populate({
            path: "lastMessage",
            populate: { path: "sender", select: "name" },
          });

        if (updatedConversation) {
          io.emit("conversation_updated", updatedConversation);
        }
      } catch (error) {
        console.error("!!! Critical Error on sendMessage:", error);
      }
    });

    socket.on("editMessage", async ({ messageId, newContent }) => {
      try {
        const userId = socket.user.id;
        const message = await Message.findById(messageId);

        if (!message || message.sender.toString() !== userId) {
          console.error("Unauthorized edit attempt or message not found.");
          return;
        }

        message.content = newContent;
        message.isEdited = true;
        await message.save();

        const populatedMessage = await Message.findById(messageId)
          .populate("sender", "name _id avatar")
          .populate({
            path: "replyTo",
            populate: { path: "sender", select: "name" },
          });

        io.to(message.conversationId.toString()).emit(
          "messageEdited",
          populatedMessage
        );
      } catch (error) {
        console.error("Error editing message:", error);
      }
    });

    socket.on("deleteMessage", async ({ messageId }) => {
      try {
        const userId = socket.user.id;
        const message = await Message.findById(messageId);

        if (!message || message.sender.toString() !== userId) {
          console.error("Unauthorized delete attempt or message not found.");
          return;
        }

        const conversationId = message.conversationId.toString();

        await Message.findByIdAndDelete(messageId);

        io.to(conversationId).emit("messageDeleted", {
          messageId,
          conversationId,
        });
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    });

    socket.on("typing", (data) => {
      if (data.conversationId) {
        socket.to(data.conversationId).emit("userTyping", {
          id: socket.id,
          name: data.name,
        });
      }
    });

    socket.on("stopTyping", (data) => {
      if (data.conversationId) {
        socket.to(data.conversationId).emit("userStoppedTyping", {
          id: socket.id,
          name: data.name,
        });
      }
    });

    socket.on("messageSeen", async ({ messageId, conversationId }) => {
      try {
        if (!messageId || !conversationId) {
          console.error(
            "messageSeen event missing messageId or conversationId"
          );
          return;
        }

        const readerId = socket.user.id;
        const message = await Message.findById(messageId);

        if (!message || message.sender.toString() === readerId) {
          return;
        }

        if (message.status === "read") {
          return;
        }

        const updatedMessage = await Message.findByIdAndUpdate(
          messageId,
          { status: "read" },
          { new: true }
        ).populate("sender", "name _id avatar");

        if (updatedMessage) {
          io.to(conversationId).emit("messageStatusUpdate", updatedMessage);
        }
      } catch (err) {
        console.error("Error updating message status:", err);
      }
    });
  });
};

module.exports = initializeSocket;
