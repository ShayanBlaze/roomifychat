import { motion } from "framer-motion";

const MessageItem = ({
  msg,
  isSentByMe,
  user,
  onImageClick,
  onUserAvatarClick,
}) => {
  const defaultAvatar =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  const senderAvatar = msg.sender?.avatar || defaultAvatar;
  const myAvatar = user?.avatar || defaultAvatar;

  return (
    <motion.div
      key={msg._id}
      layout
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`flex items-end gap-2 sm:gap-3 ${
        isSentByMe ? "justify-end" : "justify-start"
      }`}
    >
      {!isSentByMe && (
        <img
          src={senderAvatar}
          alt={msg.sender?.name}
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover cursor-pointer"
          onClick={() => onUserAvatarClick(msg.sender._id)}
        />
      )}

      <div
        className={`max-w-[80%] sm:max-w-sm md:max-w-md rounded-2xl shadow-lg ${
          isSentByMe
            ? "rounded-br-none bg-blue-600"
            : "rounded-bl-none bg-gray-700"
        } ${msg.type === "image" ? "p-1 bg-transparent" : "p-2 sm:p-3"}`}
      >
        {!isSentByMe && msg.type === "text" && (
          <h3 className="mb-1 text-xs font-bold text-blue-400">
            {msg.sender?.name || "Anonymous"}
          </h3>
        )}

        {msg.type === "image" ? (
          <motion.img
            layoutId={`chat-image-${msg.content}`}
            src={msg.content}
            alt="Sent in chat"
            className="max-w-full h-auto rounded-xl cursor-pointer"
            onClick={() => onImageClick(msg.content)}
          />
        ) : (
          <>
            <p className="text-sm sm:text-base text-white break-words">
              {msg.content}
            </p>
            {isSentByMe && (
              <div className="text-right text-xs mt-1 text-gray-300">
                {msg.status === "sent" && <span>✓</span>}
                {msg.status === "read" && <span>✓✓</span>}
              </div>
            )}
          </>
        )}
      </div>

      {isSentByMe && (
        <img
          src={myAvatar}
          alt={user?.name}
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover"
        />
      )}
    </motion.div>
  );
};

export default MessageItem;
