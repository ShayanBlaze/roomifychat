import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000/");

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [recivedMessage, setRecivedMessage] = useState([]);

  useEffect(() => {
    socket.on("testMessage", (msg) => {
      setRecivedMessage((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("testMessage");
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("testMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-indigo-600 mb-4 text-center">
          Real-time Chat Test
        </h1>

        <div className="flex-1 overflow-y-auto mb-4 border rounded-lg p-3 bg-gray-50 space-y-2">
          {recivedMessage.length === 0 ? (
            <p className="text-gray-400 text-center">No messages yet...</p>
          ) : (
            recivedMessage.map((msg, index) => (
              <div
                key={index}
                className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg shadow-sm w-fit"
              >
                {msg}
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your test message..."
          />
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
