import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../auth/hooks/useAuth";
import { io } from "socket.io-client";
import axios from "axios";

// --- Icons ---

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6"
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const AttachmentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6"
  >
    <path
      fillRule="evenodd"
      d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.5 10.5a.75.75 0 001.06 1.06l10.5-10.5a.75.75 0 011.06 0l1.5 1.5a.75.75 0 010 1.06l-6.75 6.75a2.25 2.25 0 01-3.182 0l-5.25-5.25a.75.75 0 00-1.06 1.06l5.25 5.25a3.75 3.75 0 005.304 0l6.75-6.75a2.25 2.25 0 000-3.182l-1.5-1.5z"
      clipRule="evenodd"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// --- Components ---

/**
 * A placeholder sidebar for future navigation.
 */
const Sidebar = () => {
  const channels = [
    { id: "1", name: "general", icon: "#" },
    { id: "2", name: "random", icon: "#" },
    { id: "3", name: "tech-talk", icon: "T" },
  ];
  return (
    <div className="flex flex-col w-64 bg-gray-900 p-4 space-y-4">
      <div className="text-2xl font-bold mb-4">ChatApp</div>
      <nav>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Channels
        </h2>
        <ul>
          {channels.map((channel) => (
            <li key={channel.id}>
              <a
                href="#"
                className="flex items-center space-x-3 text-gray-300 hover:bg-gray-700 p-2 rounded-md transition-colors"
              >
                <span className="flex items-center justify-center h-6 w-6 rounded-md bg-gray-700 text-sm">
                  {channel.icon}
                </span>
                <span>{channel.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

/**
 * A modal to display images in full screen, with animations.
 */
const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
        onClick={onClose}
      >
        <CloseIcon />
      </motion.button>
      <motion.img
        layoutId={`chat-image-${imageUrl}`} // For smooth animation from chat to modal
        src={imageUrl}
        alt="Enlarged view"
        className="max-w-full max-h-full rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking on image
      />
    </motion.div>
  );
};

let socket;

/**
 * The main chat page component.
 */
const ChatPage = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State for the image modal

  // Logic hooks (useEffect) remain unchanged...
  useEffect(() => {
    if (!socket) return;
    socket.on("userTyping", (data) => {
      setTypingUsers((prevUsers) =>
        prevUsers.includes(data.sender)
          ? prevUsers
          : [...prevUsers, data.sender]
      );
    });
    socket.on("userStoppedTyping", (data) => {
      setTypingUsers((prevUsers) =>
        prevUsers.filter((user) => user !== data.sender)
      );
    });
    return () => {
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [socket]);

  useEffect(() => {
    socket = io("http://localhost:3000/");
    const fetchMessages = async () => {
      if (!token) return;
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
    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    return () => {
      socket.off("newMessage");
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Event handlers remain unchanged...
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !socket) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const { data } = await axios.post("/api/v1/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.imageUrl) {
        socket.emit("sendMessage", {
          type: "image",
          content: data.imageUrl,
          sender: user,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && user && socket) {
      socket.emit("sendMessage", {
        type: "text",
        content: newMessage,
        sender: user,
      });
      setNewMessage("");
      if (socket) {
        socket.emit("stopTyping", { sender: user.name });
        setIsTyping(false);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (socket && !isTyping) {
      socket.emit("typing", { sender: user.name });
      setIsTyping(true);
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (socket) {
        socket.emit("stopTyping", { sender: user.name });
        setIsTyping(false);
      }
    }, 2000);
  };

  return (
    <div className="flex h-full flex-1 flex-col bg-gray-800 font-sans text-white">
      {/* Chat Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm p-4 shadow-md z-10">
        <div>
          <h1 className="text-xl font-bold"># general</h1>
          <div className="h-4 text-sm text-blue-400">
            <AnimatePresence>
              {typingUsers.length > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="animate-pulse"
                >
                  {typingUsers.join(", ")}
                  {typingUsers.length === 1
                    ? " is typing..."
                    : " are typing..."}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 space-y-6 overflow-y-auto p-6">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isSentByMe = msg.sender?._id === user?._id;
            return (
              <motion.div
                key={msg._id || Math.random()}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                className={`flex items-end gap-3 ${
                  isSentByMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isSentByMe && (
                  <img
                    src={`https://i.pravatar.cc/150?u=${msg.sender?._id}`}
                    alt={msg.sender?.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <div
                  className={`max-w-xs rounded-2xl p-3 shadow-lg md:max-w-md ${
                    isSentByMe
                      ? "rounded-br-none bg-blue-600"
                      : "rounded-bl-none bg-gray-700"
                  }`}
                >
                  {!isSentByMe && (
                    <h3 className="mb-1 text-xs font-bold text-blue-400">
                      {msg.sender?.name || "Anonymous"}
                    </h3>
                  )}
                  {msg.type === "image" ? (
                    <motion.img
                      layoutId={`chat-image-${msg.content}`}
                      src={msg.content}
                      alt="Image message"
                      className="mt-1 max-w-full cursor-pointer rounded-lg transition-transform duration-300 hover:scale-105"
                      style={{ maxHeight: "250px" }}
                      onClick={() => setSelectedImage(msg.content)}
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                  <div
                    className={`mt-1 text-right text-xs ${
                      isSentByMe ? "text-blue-100/70" : "text-gray-400"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </main>

      {/* Input Form */}
      <footer className="shrink-0 border-t border-gray-700 bg-gray-800 p-4">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-3"
        >
          <motion.label
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            htmlFor="file-input"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
          >
            <AttachmentIcon />
          </motion.label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-none bg-gray-700 px-5 py-2 text-sm text-white placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-gray-600"
            disabled={!newMessage.trim()}
          >
            <SendIcon />
          </motion.button>
        </form>
      </footer>

      {/* Image Modal */}
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

/**
 * The main application layout, combining Sidebar and ChatPage.
 */
const App = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <ChatPage />
    </div>
  );
};

export default App;
