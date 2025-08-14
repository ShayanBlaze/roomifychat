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
      console.error("Error updating user status to online:", err);
    }

    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));

    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(
        `User ${socket.id} (User ID: ${socket.user.id}) joined conversation: ${conversationId}`
      );
    });

    socket.on("leave_conversation", (conversationId) => {
      socket.leave(conversationId);
      console.log(
        `User ${socket.id} (User ID: ${socket.user.id}) left conversation: ${conversationId}`
      );
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      try {
        await User.findByIdAndUpdate(socket.user.id, {
          isOnline: false,
          lastSeen: new Date(),
        });
      } catch (err) {
        console.error("Error updating user status to offline:", err);
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
            populate: { path: "sender", select: "name" },
          });

        const finalMessage = populatedMessage.toObject();
        finalMessage.tempId = tempId;

        io.to(conversationId).emit("newMessage", finalMessage);

        if (conversationId !== "general") {
          const conversation = await Conversation.findById(conversationId);
          if (conversation) {
            conversation.participants.forEach((participantId) => {
              if (participantId.toString() !== senderId) {
                const userUnread = conversation.unreadCounts.find(
                  (uc) => uc.userId.toString() === participantId.toString()
                );
                if (userUnread) {
                  userUnread.count += 1;
                } else {
                  conversation.unreadCounts.push({
                    userId: participantId,
                    count: 1,
                  });
                }

                const recipientSocketId = onlineUsers.get(
                  participantId.toString()
                );
                if (recipientSocketId) {
                  const recipientSocket =
                    io.sockets.sockets.get(recipientSocketId);
                  if (
                    recipientSocket &&
                    !recipientSocket.rooms.has(conversationId)
                  ) {
                    io.to(recipientSocketId).emit("inAppNotification", {
                      message: populatedMessage,
                      conversationId: conversationId,
                      sender: populatedMessage.sender,
                    });
                  }
                }
              }
            });

            conversation.lastMessage = savedMessage._id;
            const updatedConversation = await conversation.save();

            const populatedConvo = await Conversation.findById(
              updatedConversation._id
            )
              .populate("participants", "name avatar isOnline lastSeen")
              .populate({
                path: "lastMessage",
                populate: { path: "sender", select: "name" },
              });

            if (populatedConvo) {
              populatedConvo.participants.forEach((p) => {
                const userSocketId = onlineUsers.get(p._id.toString());
                if (userSocketId) {
                  io.to(userSocketId).emit(
                    "conversation_updated",
                    populatedConvo
                  );
                }
              });
            }
          }
        }
      } catch (error) {
        console.error("!!! Critical Error on sendMessage:", error);
      }
    });

    socket.on("markConversationAsRead", async ({ conversationId }) => {
      if (conversationId === "general") {
        return;
      }

      try {
        const userId = socket.user.id;
        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: userId,
        });

        if (!conversation) return;

        await Message.updateMany(
          {
            conversationId: conversationId,
            sender: { $ne: userId },
            status: { $ne: "read" },
          },
          { $set: { status: "read" } }
        );

        const userUnread = conversation.unreadCounts.find(
          (uc) => uc.userId.toString() === userId
        );
        if (userUnread && userUnread.count > 0) {
          userUnread.count = 0;
          await conversation.save();
        }

        const updatedConversation = await Conversation.findById(conversationId)
          .populate("participants", "name avatar isOnline lastSeen")
          .populate({
            path: "lastMessage",
            populate: { path: "sender", select: "name" },
          });

        if (updatedConversation) {
          updatedConversation.participants.forEach((p) => {
            const userSocketId = onlineUsers.get(p._id.toString());
            if (userSocketId) {
              io.to(userSocketId).emit(
                "conversation_updated",
                updatedConversation
              );
              io.to(conversationId).emit("messages_read", {
                conversationId,
                readerId: userId,
              });
            }
          });
        }
      } catch (error) {
        console.error("Error in markConversationAsRead:", error);
      }
    });

    socket.on("editMessage", async ({ messageId, newContent }) => {
      try {
        const userId = socket.user.id;
        const message = await Message.findById(messageId);

        if (!message || message.sender.toString() !== userId) {
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
  });
};

module.exports = initializeSocket;
