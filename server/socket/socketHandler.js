const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

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

  io.on("connection", (socket) => {
    console.log(
      "A user connected:",
      socket.id,
      "with User ID:",
      socket.user.id
    );

    socket.join("general");
    console.log(`User ${socket.id} joined the general room`);

    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { content, type, tempId, conversationId } = data;
        const senderId = socket.user.id;

        const message = new Message({
          content,
          type,
          sender: senderId,
          conversationId,
        });
        const savedMessage = await message.save();

        if (conversationId !== "general") {
          const conversation = await Conversation.findById(conversationId);
          if (conversation) {
            const isFirstMessage = !conversation.lastMessage;
            conversation.lastMessage = savedMessage._id;
            await conversation.save();

            if (isFirstMessage) {
              const populatedConvo = await Conversation.findById(conversationId)
                .populate("participants", "name avatar")
                .populate({
                  path: "lastMessage",
                  populate: { path: "sender", select: "name" },
                });
              io.to(conversationId).emit(
                "conversation_started",
                populatedConvo
              );
            }
          }
        }

        const populatedMessage = await Message.findById(
          savedMessage._id
        ).populate("sender", "name _id avatar");

        const finalMessage = populatedMessage.toObject();
        finalMessage.tempId = tempId;

        io.to(conversationId).emit("newMessage", finalMessage);
      } catch (error) {
        console.error("!!! Critical Error:", error);
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
