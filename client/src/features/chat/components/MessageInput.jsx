import { motion } from "framer-motion";
import { SendIcon, AttachmentIcon } from "./ChatIcons";

const MessageInput = ({
  newMessage,
  handleTyping,
  handleSendMessage,
  handleFileChange,
  isUploading,
}) => {
  return (
    <footer className="shrink-0 border-t border-gray-700 bg-gray-800 p-2 sm:p-4">
      <form
        onSubmit={handleSendMessage}
        className="flex items-center space-x-2 sm:space-x-3"
      >
        <motion.label
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          htmlFor="file-input"
          className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
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
        />
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 rounded-full border-none bg-gray-700 px-4 py-2 text-sm sm:text-base text-white placeholder-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="submit"
          className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:scale-100 disabled:cursor-not-allowed disabled:bg-gray-600"
          disabled={!newMessage.trim()}
        >
          <SendIcon />
        </motion.button>
      </form>
    </footer>
  );
};

export default MessageInput;
