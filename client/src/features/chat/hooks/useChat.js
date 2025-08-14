import { useState, useEffect, useRef } from "react";
import api from "../../../services/api";
import useAuth from "../../auth/hooks/useAuth";
import { useSocket } from "../../auth/context/SocketProvider";

export const useChat = ({ conversationId }) => {
  const { socket } = useSocket();
  const { user, setConversations } = useAuth();

  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket || !conversationId) return;

    const fetchInitialMessages = async () => {
      try {
        setMessages([]);
        const response = await api.get(`/messages/${conversationId}`);
        setMessages(Array.isArray(response.data) ? response.data : []);

        socket.emit("markConversationAsRead", { conversationId });
      } catch (error) {
        console.error("Failed to fetch initial messages:", error);
        setMessages([]);
      }
    };

    socket.emit("join_conversation", conversationId);
    fetchInitialMessages();

    return () => {
      socket.emit("leave_conversation", conversationId);
    };
  }, [conversationId, socket]);

  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (receivedMessage) => {
      if (receivedMessage.conversationId === conversationId) {
        socket.emit("markConversationAsRead", { conversationId });
      }

      setMessages((prevMessages) => {
        const isOptimisticReplacement =
          receivedMessage.tempId &&
          prevMessages.some((msg) => msg.tempId === receivedMessage.tempId);

        if (isOptimisticReplacement) {
          return prevMessages.map((msg) =>
            msg.tempId === receivedMessage.tempId ? receivedMessage : msg
          );
        }

        if (!prevMessages.some((msg) => msg._id === receivedMessage._id)) {
          return [...prevMessages, receivedMessage];
        }
        return prevMessages;
      });
    };

    const handleMessagesRead = ({ conversationId: readConvoId, readerId }) => {
      if (readConvoId === conversationId) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.status !== "read" && msg.sender._id !== readerId
              ? { ...msg, status: "read" }
              : msg
          )
        );
      }
    };

    const handleUserTyping = (data) => {
      setTypingUsers((prev) => [...prev.filter((u) => u.id !== data.id), data]);
    };

    const handleUserStoppedTyping = (data) => {
      setTypingUsers((prev) => prev.filter((u) => u.id !== data.id));
    };

    const handleMessageStatusUpdate = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMsg._id ? updatedMsg : msg))
      );
    };
    const handleMessageEdited = (editedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === editedMessage._id ? editedMessage : msg))
      );
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageEdited", handleMessageEdited);
    socket.on("messageDeleted", handleMessageDeleted);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);
    socket.on("messageStatusUpdate", handleMessageStatusUpdate);
    socket.on("messages_read", handleMessagesRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageEdited", handleMessageEdited);
      socket.off("messageDeleted", handleMessageDeleted);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
      socket.off("messageStatusUpdate", handleMessageStatusUpdate);
      socket.off("messages_read", handleMessagesRead);
    };
  }, [socket, user, conversationId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = (messageData) => {
    if (socket && user) {
      const optimisticMessage = {
        _id: messageData.tempId,
        tempId: messageData.tempId,
        content: messageData.content,
        type: messageData.type,
        sender: user,
        status: "sent",
        createdAt: new Date().toISOString(),
        replyTo: messageData.replyTo || null,
      };
      setMessages((prev) => [...prev, optimisticMessage]);

      socket.emit("sendMessage", {
        content: messageData.content,
        type: messageData.type,
        tempId: messageData.tempId,
        conversationId: conversationId,
        replyTo: messageData.replyTo ? messageData.replyTo._id : null,
      });
    }
  };

  const editMessage = (messageId, newContent) => {
    if (socket) {
      socket.emit("editMessage", { messageId, newContent });
    }
  };

  const deleteMessage = (messageId) => {
    if (socket) {
      socket.emit("deleteMessage", { messageId });
    }
  };

  const emitTyping = (userName) => {
    if (socket) {
      socket.emit("typing", {
        id: socket.id,
        name: userName,
        conversationId: conversationId,
      });
    }
  };

  const emitStopTyping = (userName) => {
    if (socket) {
      socket.emit("stopTyping", {
        id: socket.id,
        name: userName,
        conversationId: conversationId,
      });
    }
  };

  return {
    messages,
    typingUsers,
    messagesEndRef,
    sendMessage,
    emitTyping,
    emitStopTyping,
    editMessage,
    deleteMessage,
  };
};
