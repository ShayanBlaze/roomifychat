import { useEffect } from "react";
import { useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000/");

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [recivedMessage, setRecivedMessage] = useState([]);

  useEffect(() => {
    socket.on("testMessage", (msg) => {
      console.log("New message received:", msg);
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
    <div>
      <h1>Real-time Chat Test</h1>

      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          placeholder="Type your test message"
        />
        <button type="submit">Send</button>
      </form>

      <div>
        <h2>Recived Message:</h2>
        <ul>
          {recivedMessage.map((msg, index) => {
            return <li key={index}>{msg}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default ChatPage;
