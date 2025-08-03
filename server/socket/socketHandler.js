const Message = require("../models/Message");

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { content, type, sender, tempId } = data;

        const message = new Message({
          content: content,
          type: type,
          sender: sender._id,
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
        console.error("Error saving or broadcasting message:", error);

        socket.emit("messageError", { error: "Could not send message." });
      }
    });

    socket.on("typing", (data) => {
      socket.broadcast.emit("userTyping", data);
    });

    socket.on("stopTyping", (data) => {
      socket.broadcast.emit("userStoppedTyping", data);
    });
  });
};

module.exports = initializeSocket;
