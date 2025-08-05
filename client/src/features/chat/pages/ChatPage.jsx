import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";

import useAuth from "../../auth/hooks/useAuth";
import { useChat } from "../hooks/useChat";

import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import ImageModal from "../components/ImageModal";
import api from "../../../services/api";

const ChatPage = () => {
  const { onMenuClick } = useOutletContext();
  const { user } = useAuth();

  const {
    messages,
    typingUsers,
    messagesEndRef,
    sendMessage,
    emitTyping,
    emitStopTyping,
  } = useChat();

  const [isUploading, setIsUploading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const typingTimeoutRef = useRef(null);

  if (!user) {
    return (
      <div className="flex flex-1 justify-center items-center h-full text-white">
        Loading chat...
      </div>
    );
  }

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      const tempId = Date.now().toString();
      sendMessage({
        tempId,
        content: newMessage,
        type: "text",
        sender: user,
      });
      setNewMessage("");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      emitStopTyping(user.name);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!typingTimeoutRef.current) {
      emitTyping(user.name);
    }
    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(user.name);
      typingTimeoutRef.current = null;
    }, 2000);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const { data } = await api.post("/upload/chat-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.url) {
        sendMessage({
          tempId: Date.now().toString(),
          type: "image",
          content: data.url,
          sender: user,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col bg-gray-800 font-sans text-white">
      <ChatHeader typingUsers={typingUsers} onMenuClick={onMenuClick} />

      <MessageList
        messages={messages}
        user={user}
        onImageClick={setSelectedImage}
        messagesEndRef={messagesEndRef}
      />

      <MessageInput
        newMessage={newMessage}
        handleTyping={handleTyping}
        handleSendMessage={handleSendMessage}
        handleFileChange={handleFileChange}
        isUploading={isUploading}
      />

      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            imageUrl={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;
