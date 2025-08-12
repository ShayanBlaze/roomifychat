import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiX } from "react-icons/fi";
import { ImAttachment } from "react-icons/im";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";

const isRTL = (text) => {
  if (!text) return false;
  const rtlRegex = /[\u0600-\u06FF]/;
  return rtlRegex.test(text.trim().charAt(0));
};

const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleFileChange,
  replyingTo,
  editingMessage,
  onCancelAction,
  isUploading,
  onTyping,
}) => {
  const isRtl = isRTL(newMessage);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (editingMessage) {
      setNewMessage(editingMessage.content);
    }
  }, [editingMessage, setNewMessage]);

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
    setShowPicker(false);
  };

  return (
    <footer className="shrink-0 bg-gray-800/50 backdrop-blur-sm p-2 sm:p-4">
      <AnimatePresence>
        {(replyingTo || editingMessage) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-between p-2 mb-2 bg-gray-900/50 rounded-lg text-sm"
          >
            <div>
              <p className="font-bold text-cyan-400">
                {editingMessage
                  ? "Editing Message"
                  : `Replying to ${replyingTo.sender.name}`}
              </p>
              <p className="text-gray-300 truncate max-w-xs sm:max-w-md">
                {editingMessage ? editingMessage.content : replyingTo.content}
              </p>
            </div>
            <button
              onClick={onCancelAction}
              className="p-1 rounded-full hover:bg-gray-700"
            >
              <FiX className="h-5 w-5 text-gray-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {showPicker && (
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            right: "20px",
            zIndex: "1000",
          }}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            emojiStyle={EmojiStyle.TWITTER}
          />
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="relative flex items-center gap-2 sm:gap-3 bg-gray-900/70 rounded-full px-2 py-1.5"
      >
        <label
          htmlFor="file-input"
          className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
          ) : (
            <ImAttachment />
          )}
        </label>
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <motion.button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
        >
          😊
        </motion.button>

        <input
          type="text"
          value={newMessage}
          onChange={onTyping}
          placeholder="start typing..."
          className={`w-full bg-transparent text-white placeholder-gray-500 outline-none ${
            isRtl ? "text-right" : "text-left"
          }`}
          dir="auto"
          onFocus={() => setShowPicker(false)}
        />

        {newMessage.trim() && (
          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white transition-all"
          >
            <FiSend />
          </motion.button>
        )}
      </form>
    </footer>
  );
};

export default MessageInput;
