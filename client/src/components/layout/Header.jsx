import { AnimatePresence, motion } from "framer-motion";
import { IoMenuOutline } from "react-icons/io5";

const Header = ({
  onMenuClick,
  title,
  avatar,
  activityStatus,
  typingUsers,
}) => {
  const getTypingText = () => {
    if (!typingUsers || typingUsers.length === 0) return "";
    const names = typingUsers.map((u) => u.name);
    if (names.length === 1) return `${names[0]} is typing...`;
    if (names.length === 2) return `${names[0]} and ${names[1]} are typing...`;
    return "Several people are typing...";
  };

  return (
    <header className="flex shrink-0 items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
      {/* Mobile Menu Button */}
      <button onClick={onMenuClick} className="p-2 text-white md:hidden">
        <IoMenuOutline className="w-6 h-6" />
      </button>

      <div className="flex items-center flex-grow md:ml-0 ml-4 gap-3">
        {avatar && (
          <img src={avatar} alt={title} className="w-10 h-10 rounded-full" />
        )}
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white">{title}</h1>
          <div className="h-5 text-xs sm:text-sm text-cyan-400">
            <AnimatePresence mode="wait">
              {typingUsers && typingUsers.length > 0 ? (
                <motion.p
                  key="typing"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="font-semibold"
                >
                  {getTypingText()}
                </motion.p>
              ) : (
                activityStatus && (
                  <motion.p
                    key="status"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-400"
                  >
                    {activityStatus}
                  </motion.p>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="w-8 h-8 md:hidden"></div>
    </header>
  );
};

export default Header;
