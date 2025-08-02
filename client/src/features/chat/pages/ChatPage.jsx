import { useState, useEffect, useRef } from "react";
import useAuth from "../../auth/hooks/useAuth";
import { io } from "socket.io-client";
import axios from "axios";

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
    className="h-6 w-6 text-gray-500 hover:text-blue-600 cursor-pointer"
  >
    <path
      fillRule="evenodd"
      d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.5 10.5a.75.75 0 001.06 1.06l10.5-10.5a.75.75 0 011.06 0l1.5 1.5a.75.75 0 010 1.06l-6.75 6.75a2.25 2.25 0 01-3.182 0l-5.25-5.25a.75.75 0 00-1.06 1.06l5.25 5.25a3.75 3.75 0 005.304 0l6.75-6.75a2.25 2.25 0 000-3.182l-1.5-1.5z"
      clipRule="evenodd"
    />
  </svg>
);

let socket;

const ChatPage = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // listening on user typing
    socket.on("userTyping", (data) => {
      // include user in typingUsers if not already present
      setTypingUsers((prevUsers) =>
        prevUsers.includes(data.sender)
          ? prevUsers
          : [...prevUsers, data.sender]
      );
    });

    // listening on user stopped typing
    socket.on("userStoppedTyping", (data) => {
      // remove user from typingUsers
      setTypingUsers((prevUsers) =>
        prevUsers.filter((user) => user !== data.sender)
      );
    });

    // cleanup listeners on component unmount
    return () => {
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [socket]);

  useEffect(() => {
    // socket connect
    socket = io("http://localhost:3000/");

    // Fetch previous messages
    const fetchMessages = async () => {
      if (!token) return;
      try {
        const response = await axios.get("/api/v1/messages/general", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
          setMessages(response.data);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    fetchMessages();

    // Listen for new messages (both text and image)
    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("newMessage");
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !socket) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post("/api/v1/upload", formData, config);
      const { imageUrl } = data;

      if (imageUrl) {
        const messageData = {
          type: "image",
          content: imageUrl,
          sender: user,
        };
        socket.emit("sendMessage", messageData);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && user && socket) {
      const messageData = {
        type: "text",
        content: newMessage,
        sender: user,
      };
      socket.emit("sendMessage", messageData);
      setNewMessage("");
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    // include user in typingUsers if not already present
    if (socket && !isTyping) {
      socket.emit("typing", { sender: user.name });
      setIsTyping(true);
    }

    // reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // set a new timeout. If the user stops typing for 2 seconds, emit 'stopTyping' event
    typingTimeoutRef.current = setTimeout(() => {
      if (socket) {
        socket.emit("stopTyping", { sender: user.name });
        setIsTyping(false);
      }
    }, 2000);
  };

  return (
    <div className="flex h-[90vh] flex-col overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-lg sm:mx-auto sm:my-8 sm:max-w-2xl md:max-w-3xl">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white p-4">
        <h1 className="text-xl font-semibold text-gray-800">
          General Chat Room
        </h1>
        <div className="text-black">
          {typingUsers.length > 0 && (
            <p>
              {typingUsers.join(", ")}
              {typingUsers.length === 1 ? " is typing..." : " are typing..."}
            </p>
          )}
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.map((msg) => {
          const isSentByMe = msg.sender?._id === user?._id;
          return (
            <div
              key={msg._id}
              className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-4 py-3 shadow md:max-w-md ${
                  isSentByMe
                    ? "rounded-br-lg bg-blue-600 text-white"
                    : "rounded-bl-lg border border-gray-200 bg-white text-gray-800"
                }`}
              >
                {/* display sender name if not sent by me */}
                {!isSentByMe && (
                  <h3 className="mb-1 text-xs font-bold text-blue-600">
                    {msg.sender?.name}
                  </h3>
                )}
                {/* check message type */}
                {msg.type === "image" ? (
                  <img
                    src={msg.content}
                    alt="Image message"
                    className="mt-1 max-w-full rounded-lg h-auto"
                    style={{ maxHeight: "250px" }}
                  />
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
                <div
                  className={`mt-1 text-right text-xs ${
                    isSentByMe ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Form */}
      <footer className="border-t border-gray-200 bg-white p-4">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-3"
        >
          {/* File input for image uploads */}
          <label htmlFor="file-input">
            <AttachmentIcon />
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {/* Text input */}
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoComplete="off"
          />
          {/* Send button */}
          <button
            type="submit"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition duration-200 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!newMessage.trim()}
          >
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatPage;
