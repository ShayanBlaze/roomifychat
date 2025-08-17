import { motion } from "framer-motion";
import twemoji from "twemoji";
import DOMPurify from "dompurify";
import { FiCornerUpLeft, FiEdit2, FiImage } from "react-icons/fi";

const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const isRTL = (text) => {
  if (!text) return false;
  const rtlRegex = /[\u0600-\u06FF]/;
  return rtlRegex.test(text.trim().charAt(0));
};

const RenderParsedText = ({ content }) => {
  const isRtl = isRTL(content);
  const parsedHtml = twemoji.parse(content, {
    folder: "svg",
    ext: ".svg",
  });

  const cleanHtml = DOMPurify.sanitize(parsedHtml);

  return (
    <p
      className={`text-sm sm:text-base break-words ${
        isRtl ? "text-right" : "text-left"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

const ReplyPreview = ({ message, onScrollToReply }) => {
  const isImageReply = message.type === "image";
  const replyContent = isImageReply ? "Image" : message.content || "...";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="mb-1.5 p-2 bg-black/25 rounded-lg cursor-pointer overflow-hidden backdrop-blur-sm"
      onClick={(e) => {
        e.stopPropagation();
        onScrollToReply(message._id);
      }}
    >
      <div className="flex items-center gap-2">
        <FiCornerUpLeft className="text-cyan-400 shrink-0 w-4 h-4" />
        <p className="font-bold text-sm text-cyan-300 truncate">
          {message.sender?.name || "User"}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-1 pl-6">
        {isImageReply && <FiImage className="text-gray-400 shrink-0 w-4 h-4" />}
        <p className="text-sm text-gray-300 truncate">{replyContent}</p>
      </div>
    </motion.div>
  );
};

const MessageItem = ({
  msg,
  isSentByMe,
  onImageClick,
  onUserAvatarClick,
  onOpenMenu,
  onScrollToReply,
}) => {
  const defaultAvatar =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  const senderAvatar = msg.sender?.avatar || defaultAvatar;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const SentMessageBubble = () => (
    <div
      onContextMenu={(e) => onOpenMenu(e, msg)}
      className={`max-w-[80%] sm:max-w-md md:max-w-lg rounded-3xl rounded-br-lg shadow-lg relative cursor-pointer
        ${
          msg.type === "image"
            ? "p-1.5 bg-gradient-to-br from-teal-500 to-cyan-500"
            : "p-3 sm:p-4 bg-gradient-to-br from-teal-600 to-cyan-600 text-white min-w-[120px]"
        }`}
    >
      {msg.replyTo && (
        <ReplyPreview message={msg.replyTo} onScrollToReply={onScrollToReply} />
      )}

      {msg.type === "image" ? (
        <>
          <motion.img
            layoutId={`chat-image-${msg.content}`}
            src={msg.content}
            alt="Sent in chat"
            className="max-w-full h-auto rounded-2xl min-w-[120px]"
            onClick={() => onImageClick(msg.content)}
          />
          <div className="absolute bottom-3 right-3 bg-black/50 rounded-full px-2 py-0.5 flex items-center gap-1.5 text-xs text-white">
            {msg.isEdited && (
              <FiEdit2 className="w-3 h-3 mr-1" title="Edited" />
            )}

            <span>{formatTime(msg.createdAt)}</span>
            {msg.status === "sent" && <span>✓</span>}
            {msg.status === "read" && <span className="font-bold">✓✓</span>}
          </div>
        </>
      ) : (
        <>
          <div className="pb-4">
            <RenderParsedText content={msg.content} />
          </div>
          <div className="absolute bottom-1.5 right-3 flex items-center gap-1.5 text-xs text-cyan-100/90">
            {msg.isEdited && (
              <FiEdit2 className="w-3 h-3 mr-1" title="Edited" />
            )}
            <span>{formatTime(msg.createdAt)}</span>
            {msg.status === "sent" && <span>✓</span>}
            {msg.status === "read" && <span className="font-bold">✓✓</span>}
          </div>
        </>
      )}
    </div>
  );

  const ReceivedMessageBubble = () => (
    <div
      onContextMenu={(e) => onOpenMenu(e, msg)}
      className={`max-w-[80%] sm:max-w-md md:max-w-lg rounded-3xl rounded-bl-lg shadow-lg relative cursor-pointer
        ${
          msg.type === "image"
            ? "p-0 bg-transparent"
            : "p-3 sm:p-4 bg-gray-700 text-white min-w-[120px]"
        }`}
    >
      {msg.replyTo && (
        <ReplyPreview message={msg.replyTo} onScrollToReply={onScrollToReply} />
      )}
      {msg.type === "image" ? (
        <>
          <motion.img
            layoutId={`chat-image-${msg.content}`}
            src={msg.content}
            alt="Sent in chat"
            className="max-w-full h-auto rounded-2xl border-2 border-gray-700 min-w-[120px]"
            onClick={() => onImageClick(msg.content)}
          />
          <div className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-0.5 flex items-center gap-1.5 text-xs text-white">
            {msg.isEdited && (
              <FiEdit2 className="w-3 h-3 mr-1" title="Edited" />
            )}
            <span>{formatTime(msg.createdAt)}</span>
          </div>
        </>
      ) : (
        <>
          <div className="pb-4">
            <RenderParsedText content={msg.content} />
          </div>
          <div className="absolute bottom-1.5 right-3 flex items-center gap-1.5 text-xs text-gray-400">
            {msg.isEdited && (
              <FiEdit2 className="w-3 h-3 mr-1" title="Edited" />
            )}
            <span>{formatTime(msg.createdAt)}</span>
          </div>
        </>
      )}
    </div>
  );

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex flex-col ${isSentByMe ? "items-end" : "items-start"}`}
      id={`message-${msg._id}`}
    >
      {!isSentByMe && (
        <div className="flex items-center gap-2 mb-1.5 ml-12">
          <span className="text-xs font-bold text-gray-400">
            {msg.sender?.name || "Anonymous"}
          </span>
        </div>
      )}

      <div
        className={`flex items-end gap-2 sm:gap-3 ${
          isSentByMe ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {!isSentByMe && (
          <img
            src={senderAvatar}
            alt={msg.sender?.name}
            className="h-8 w-8 rounded-full object-cover cursor-pointer self-start"
            onClick={() => onUserAvatarClick(msg.sender._id)}
          />
        )}

        {isSentByMe ? <SentMessageBubble /> : <ReceivedMessageBubble />}
      </div>
    </motion.div>
  );
};

export default MessageItem;
