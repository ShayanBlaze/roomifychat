// features/chat/components/ChatHeader.jsx

import { motion, AnimatePresence } from "framer-motion";

const ChatHeader = ({ typingUsers }) => {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm p-3 sm:p-4 shadow-md z-10">
      <div>
        <h1 className="text-lg sm:text-xl font-bold"># general</h1>
        <div className="h-5 text-xs sm:text-sm text-blue-400">
          <AnimatePresence>
            {typingUsers.length > 0 && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="animate-pulse"
              >
                {typingUsers.join(", ")}
                {typingUsers.length === 1 ? " is typing..." : " are typing..."}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
