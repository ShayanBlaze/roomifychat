import { motion, AnimatePresence } from "framer-motion";

const MessageIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const CloseIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: {
    y: "-50px",
    opacity: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

const contentContainerVariants = {
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  hidden: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const contentItemVariants = {
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 200 } },
  hidden: { y: 20, opacity: 0 },
};

const UserProfilePopup = ({ user, show, onClose }) => {
  return (
    <AnimatePresence>
      {show && user && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full mx-4 border border-gray-700"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors rounded-full p-1 hover:bg-gray-700"
              aria-label="Close"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <CloseIcon className="h-6 w-6" />
            </motion.button>

            <motion.div
              className="flex flex-col items-center"
              variants={contentContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={contentItemVariants}
                className="p-1 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full"
              >
                <img
                  src={user.avatar}
                  alt={`${user.name}'s avatar`}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-800"
                />
              </motion.div>

              <motion.div
                variants={contentItemVariants}
                className="text-center mt-4"
              >
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-md text-gray-400 mt-1">{user.email}</p>
              </motion.div>

              {user.bio && (
                <motion.p
                  variants={contentItemVariants}
                  className="text-sm text-center text-gray-300 mt-4 border-t border-gray-700 pt-4"
                >
                  {user.bio}
                </motion.p>
              )}

              <motion.div
                variants={contentItemVariants}
                className="flex space-x-4 mt-6"
              >
                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
                  <MessageIcon className="h-5 w-5" />
                  <span>Message</span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserProfilePopup;
