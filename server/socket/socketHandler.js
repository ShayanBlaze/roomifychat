const Message = require("../models/Message");

const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const message = new Message({
          content: data.content,
          type: data.type,
          sender: data.sender._id,
          chat: "general",
        });

        const savedMessage = await message.save();

        const populatedMessage = await Message.findById(
          savedMessage._id
        ).populate("sender", "name _id avatar");

        io.emit("newMessage", populatedMessage);
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
