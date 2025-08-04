import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import axios from "axios";

// --- Hooks ---
import useAuth from "../../auth/hooks/useAuth";
import { useChat } from "../hooks/useChat";

// --- Components ---
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import ImageModal from "../components/ImageModal";

/**
 * The main chat page component, which orchestrates all chat-related components and logic.
 */
const ChatPage = () => {
  const { user, token } = useAuth();
  const {
    messages,
    typingUsers,
    messagesEndRef,
    sendMessage,
    emitTyping,
    emitStopTyping,
  } = useChat(user, token);

  const [isUploading, setIsUploading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const typingTimeoutRef = useRef(null);

  // --- Event Handlers ---
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
      emitStopTyping(user.name);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!typingTimeoutRef.current) {
      emitTyping(user.name);
    } else {
      clearTimeout(typingTimeoutRef.current);
    }

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
      const uploadConfig = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        "/api/v1/upload/chat-image",
        formData,
        uploadConfig
      );

      if (data.url) {
        sendMessage({
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
      <ChatHeader typingUsers={typingUsers} />

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
