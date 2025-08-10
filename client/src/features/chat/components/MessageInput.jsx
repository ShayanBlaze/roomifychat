import { useState } from "react";
import { motion } from "framer-motion";
import { SendIcon, AttachmentIcon } from "./ChatIcons";
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
  isUploading,
}) => {
  const isRtl = isRTL(newMessage);
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
    setShowPicker(false);
  };

  return (
    <footer className="shrink-0 bg-gray-800/50 backdrop-blur-sm p-2 sm:p-4">
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
          <AttachmentIcon />
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
          onChange={(e) => setNewMessage(e.target.value)}
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
            <SendIcon />
          </motion.button>
        )}
      </form>
    </footer>
  );
};

export default MessageInput;
