import { AnimatePresence } from "framer-motion";
import MessageItem from "./MessageItem";

const MessageList = ({
  messages,
  user,
  onImageClick,
  messagesEndRef,
  onUserAvatarClick,
}) => {
  return (
    // Changed space-y-4 to space-y-6 for more breathing room
    <main className="flex-1 space-y-6 overflow-y-auto p-3 sm:p-4 md:p-6">
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <MessageItem
            key={msg.tempId || msg._id}
            msg={msg}
            isSentByMe={msg.sender?._id === user?._id}
            user={user}
            onImageClick={onImageClick}
            onUserAvatarClick={onUserAvatarClick}
          />
        ))}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </main>
  );
};

export default MessageList;
