import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import Logo from "/chat-bubble.png";

const PublicHeader = () => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [expanded]);

  const mobileMenuVariants = {
    hidden: { x: "100%", transition: { duration: 0.3, ease: "easeInOut" } },
    visible: {
      x: 0,
      transition: { duration: 0.3, ease: "easeInOut", staggerChildren: 0.1 },
    },
  };

  const mobileLinkVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <>
      <header className="py-4 sm:py-6 relative z-30">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              title="RoomifyChat"
              className="flex items-center gap-3"
            >
              <img className="w-auto h-10" src={Logo} alt="RoomifyChat Logo" />
              <span className="text-xl font-semibold text-white">
                Roomify<span className="text-cyan-400">Chat</span>
              </span>
            </Link>
            <div className="flex md:hidden">
              <button onClick={() => setExpanded(true)} className="text-white">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              <NavLink
                to="/login"
                className="text-base font-medium text-gray-300 hover:text-white transition-colors"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="px-6 py-2 text-base font-semibold text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Get Started
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(false)}
            />
            <motion.nav
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-gray-900 shadow-lg z-50 p-8 flex flex-col"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <button
                onClick={() => setExpanded(false)}
                className="self-end text-gray-400 hover:text-white"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="flex flex-col items-start space-y-8 mt-16">
                <motion.div variants={mobileLinkVariants}>
                  <NavLink
                    to="/"
                    onClick={() => setExpanded(false)}
                    className="text-2xl font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </NavLink>
                </motion.div>
                <motion.div variants={mobileLinkVariants}>
                  <NavLink
                    to="/login"
                    onClick={() => setExpanded(false)}
                    className="text-2xl font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Login
                  </NavLink>
                </motion.div>
                <motion.div variants={mobileLinkVariants}>
                  <NavLink
                    to="/register"
                    onClick={() => setExpanded(false)}
                    className="px-6 py-3 text-xl font-semibold text-black bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors"
                  >
                    Get Started
                  </NavLink>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PublicHeader;
