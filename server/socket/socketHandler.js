const jwt = require("jsonwebtoken");
const Message = require("../models/Message");

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

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    socket.on("sendMessage", async (data) => {
      console.log("Received 'sendMessage' event with data:", data);
      console.log("User from socket:", socket.user);

      try {
        const { content, type, tempId } = data;

        const senderId = socket.user.id;

        const message = new Message({
          content: content,
          type: type,
          sender: senderId,
          chat: "general",
        });

        const savedMessage = await message.save();
        const populatedMessage = await Message.findById(
          savedMessage._id
        ).populate("sender", "name _id avatar");

        const finalMessage = populatedMessage.toObject();
        finalMessage.tempId = tempId;

        io.emit("newMessage", finalMessage);
      } catch (error) {
        console.error(
          "!!! Critical Error saving or broadcasting message:",
          error
        );
        socket.emit("messageError", {
          error: "Could not send message.",
          details: error.message,
        });
      }
    });

    socket.on("typing", (data) => {
      socket.broadcast.emit("userTyping", data);
    });

    socket.on("stopTyping", (data) => {
      socket.broadcast.emit("userStoppedTyping", data);
    });

    socket.on("messageSeen", async ({ messageId }) => {
      try {
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
          io.emit("messageStatusUpdate", updatedMessage);
        }
      } catch (err) {
        console.error("Error updating message status:", err);
      }
    });
  });
};

module.exports = initializeSocket;
