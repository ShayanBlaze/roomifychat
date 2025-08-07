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
      console.log("Received 'sendMessage' event with data:", data);
      console.log("User from socket:", socket.user);

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
          await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: savedMessage._id,
          });
        }

        const populatedMessage = await Message.findById(
          savedMessage._id
        ).populate("sender", "name _id avatar");

        const finalMessage = populatedMessage.toObject();
        finalMessage.tempId = tempId;

        io.to(conversationId).emit("newMessage", populatedMessage.toObject());
      } catch (error) {
        console.error(
          "!!! Critical Error saving or broadcasting message:",
          error
        );
        socket.emit("messageError", {
          error: "Could not send message.",
          details: error.message,
          tempId: data.tempId,
        });
      }
    });

    socket.on("typing", (data) => {
      if (data.conversationId) {
        socket.to(data.conversationId).emit("userTyping", { user: data.user });
      }
    });

    socket.on("stopTyping", (data) => {
      // data should include conversationId
      if (data.conversationId) {
        socket.to(data.conversationId).emit("userStoppedTyping", {});
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
