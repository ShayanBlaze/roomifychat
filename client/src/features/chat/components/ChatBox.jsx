const ChatBox = () => {
  return (
    <div>
      <h2>Chat</h2>
      <div className="messages">{/* Messages will be rendered here */}</div>
      <div className="input-area">
        <input type="text" placeholder="Type a message..." />
        <button>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
