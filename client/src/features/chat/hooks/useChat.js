import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

let socket;

export const useChat = (user, token) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Effect for initializing socket and fetching initial messages
  useEffect(() => {
    if (!token || !user) return;

    socket = io("http://localhost:3000/");

    const fetchMessages = async () => {
      try {
        const response = await axios.get("/api/v1/messages/general", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();

    // --- Socket Event Listeners ---
    socket.on("newMessage", (receivedMessage) => {
      setMessages((prevMessages) => {
        const isConfirmation =
          receivedMessage.tempId && receivedMessage.sender._id === user._id;
        if (isConfirmation) {
          return prevMessages.map((msg) =>
            msg._id === receivedMessage.tempId ? receivedMessage : msg
          );
        } else if (
          !prevMessages.some((msg) => msg._id === receivedMessage._id)
        ) {
          return [...prevMessages, receivedMessage];
        }
        return prevMessages;
      });
    });

    socket.on("userTyping", (data) => {
      setTypingUsers((prev) =>
        prev.includes(data.sender) ? prev : [...prev, data.sender]
      );
    });

    socket.on("userStoppedTyping", (data) => {
      setTypingUsers((prev) => prev.filter((u) => u !== data.sender));
    });

    socket.on("messageStatusUpdate", (updatedMsg) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMsg._id ? updatedMsg : msg))
      );
    });

    // --- Cleanup ---
    return () => {
      socket.off("newMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.off("messageStatusUpdate");
      socket.disconnect();
    };
  }, [token, user]);

  // Effect for auto-scrolling and marking messages as read
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    const unreadMessages = messages.filter(
      (msg) => msg.status !== "read" && msg.sender._id !== user?._id
    );

    if (unreadMessages.length > 0 && socket) {
      socket.emit("messageSeen", {
        messageId: unreadMessages[0]._id,
        readerId: user._id,
      });
    }
  }, [messages, user]);

  // --- Emitter Functions ---
  const sendMessage = (messageData) => {
    if (socket) {
      // Add temporary message to state immediately for better UX
      if (messageData.type === "text") {
        const tempMessage = {
          _id: messageData.tempId,
          content: messageData.content,
          type: "text",
          sender: user,
          status: "sent",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempMessage]);
      }
      socket.emit("sendMessage", messageData);
    }
  };

  const emitTyping = (userName) => {
    if (socket) socket.emit("typing", { sender: userName });
  };

  const emitStopTyping = (userName) => {
    if (socket) socket.emit("stopTyping", { sender: userName });
  };

  return {
    messages,
    typingUsers,
    messagesEndRef,
    sendMessage,
    emitTyping,
    emitStopTyping,
  };
};
