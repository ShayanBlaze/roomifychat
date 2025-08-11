import { useState, useRef, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useParams, useOutletContext } from "react-router-dom";

import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import ImageModal from "../components/ImageModal";
import UserProfilePopup from "../components/UserProfilePopup";

import useAuth from "../../auth/hooks/useAuth";
import { useChat } from "../hooks/useChat";

import api from "../../../services/api";
import { groupMessagesByDate } from "../../../utils/messageUtil";

const ChatPage = () => {
  const { user } = useAuth();
  const { conversationId } = useParams();

  const {
    messages,
    messagesEndRef,
    sendMessage,
    emitTyping,
    emitStopTyping,
    typingUsers,
  } = useChat({ conversationId });

  const { setTypingUsers } = useOutletContext();

  const [isUploading, setIsUploading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const typingTimeoutRef = useRef(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesWithDateSeparators = useMemo(() => {
    return groupMessagesByDate(messages);
  }, [messages]);

  useEffect(() => {
    if (setTypingUsers) {
      setTypingUsers(typingUsers);
    }
    return () => {
      if (setTypingUsers) {
        setTypingUsers([]);
      }
    };
  }, [typingUsers, setTypingUsers]);

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

  const handleUserClick = async (userId) => {
    if (!userId) return;

    try {
      const { data } = await api.get(`/user/${userId}`);
      setSelectedUser(data);
      setPopupVisible(true);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedUser(null);
  };

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <MessageList
        messages={messagesWithDateSeparators}
        user={user}
        onImageClick={setSelectedImage}
        messagesEndRef={messagesEndRef}
        onUserAvatarClick={handleUserClick}
      />

      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onTyping={handleTyping}
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

      <UserProfilePopup
        user={selectedUser}
        show={isPopupVisible}
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default ChatPage;
