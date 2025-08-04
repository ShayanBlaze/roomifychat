// features/chat/components/ChatHeader.jsx

import { motion, AnimatePresence } from "framer-motion";

const ChatHeader = ({ typingUsers }) => {
  const getTypingText = () => {
    const names = typingUsers;
    if (names.length === 0) return "";
    if (names.length === 1) return `${names[0]} is typing...`;
    if (names.length === 2) return `${names[0]} and ${names[1]} are typing...`;
    return "Several people are typing...";
  };

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
                {getTypingText()}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
