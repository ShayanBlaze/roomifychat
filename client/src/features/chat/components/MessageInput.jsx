import { motion } from "framer-motion";
import { SendIcon, AttachmentIcon } from "./ChatIcons";

// Helper function to detect RTL text based on the first character
const isRTL = (text) => {
  if (!text) return false;
  const rtlRegex = /[\u0600-\u06FF]/;
  return rtlRegex.test(text.trim().charAt(0));
};

const MessageInput = ({
  newMessage,
  handleTyping,
  handleSendMessage,
  handleFileChange,
  isUploading,
}) => {
  // Calculate the direction once
  const isRtl = isRTL(newMessage);

  return (
    <footer className="shrink-0 bg-gray-800/50 backdrop-blur-sm p-2 sm:p-4">
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 sm:gap-3 bg-gray-900/70 rounded-full px-2 py-1.5"
      >
        <motion.label
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          htmlFor="file-input"
          className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
          ) : (
            <AttachmentIcon />
          )}
        </motion.label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          // Final solution: Using both `dir` attribute and `text-align` class
          className={`flex-1 border-none bg-transparent px-2 py-2 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-0 ${
            isRtl ? "text-right" : "text-left"
          }`}
          dir={isRtl ? "rtl" : "ltr"}
          autoComplete="off"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-gray-600 disabled:bg-none"
          disabled={!newMessage.trim() && !isUploading}
          style={{
            background: newMessage.trim()
              ? "linear-gradient(to bottom right, #2DD4BF, #06B6D4)"
              : "",
          }}
        >
          <SendIcon />
        </motion.button>
      </form>
    </footer>
  );
};

export default MessageInput;
