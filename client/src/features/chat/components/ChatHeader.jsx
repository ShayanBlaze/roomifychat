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

const ChatHeader = ({ typingUsers, onMenuClick, title, avatar }) => {
  const getTypingText = () => {
    const names = typingUsers;
    if (names.length === 0) return "";
    if (names.length === 1) return `${names[0].name} is typing...`;
    if (names.length === 2)
      return `${names[0].name} and ${names[1].name} are typing...`;
    return "Several people are typing...";
  };

  return (
    <header className="flex shrink-0 items-center justify-between bg-gray-800/50 backdrop-blur-sm p-3 sm:p-4 z-10">
      {/* Hamburger menu button for mobile */}
      <button onClick={onMenuClick} className="p-2 text-white md:hidden">
        <MenuIcon />
      </button>

      <div className="flex items-center flex-grow md:ml-0 ml-4 gap-3">
        {avatar && (
          <img src={avatar} alt={title} className="w-10 h-10 rounded-full" />
        )}
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white">{title}</h1>
          <div className="h-5 text-xs sm:text-sm text-cyan-400">
            <AnimatePresence>
              {typingUsers.length > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="font-semibold"
                >
                  {getTypingText()}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Empty div for aligning the title correctly */}
      <div className="w-8 h-8 md:hidden"></div>
    </header>
  );
};

export default ChatHeader;
