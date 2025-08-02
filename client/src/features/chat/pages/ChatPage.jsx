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

const socket = io("http://localhost:3000/");

const ChatPage = () => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
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

    socket.on("chatMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, [token]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      socket.emit("chatMessage", {
        content: newMessage,
        senderId: user._id,
      });
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-[90vh] flex-col overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-lg sm:mx-auto sm:my-8 sm:max-w-2xl md:max-w-3xl">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white p-4">
        <h1 className="text-xl font-semibold text-gray-800">
          General Chat Room
        </h1>
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
                {!isSentByMe && (
                  <h3 className="mb-1 text-xs font-bold text-blue-600">
                    {msg.sender?.name}
                  </h3>
                )}
                <p className="text-sm">{msg.content}</p>
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
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoComplete="off"
          />
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
