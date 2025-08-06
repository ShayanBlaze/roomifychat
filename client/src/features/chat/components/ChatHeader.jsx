import { motion, AnimatePresence } from "framer-motion";

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const ChatHeader = ({ typingUsers, onMenuClick }) => {
  const getTypingText = () => {
    const names = typingUsers;
    console.log(typingUsers[0].name);
    if (names.length === 0) return "";
    if (names.length === 1) return `${names[0].name} is typing...`;
    if (names.length === 2)
      return `${names[0].name} and ${names[1].name} are typing...`;
    return "Several people are typing...";
  };

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm p-3 sm:p-4 shadow-md z-10">
      {/* Hamburger menu button for mobile */}
      <button onClick={onMenuClick} className="p-2 text-white md:hidden">
        <MenuIcon />
      </button>

      <div className="flex-grow md:ml-0 ml-4">
        <h1 className="text-lg sm:text-xl font-bold text-white"># general</h1>
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

      {/* Empty div for future alignment */}
      <div className="w-8 h-8"></div>
    </header>
  );
};

export default ChatHeader;
