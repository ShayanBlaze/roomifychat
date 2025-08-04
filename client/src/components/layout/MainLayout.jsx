// src/components/layout/MainLayout.jsx

import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../../features/auth/hooks/useAuth";

// --- Reusable Icons ---
const HomeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);
const ChatIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);
const LogoutIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Style for active NavLink
  const activeLinkStyle = {
    backgroundColor: "rgba(5, 150, 105, 0.2)", // emerald-500 with 20% opacity
    color: "white",
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-gray-300">
      {/* --- Sidebar Navigation --- */}
      <motion.aside
        className="flex flex-col w-20 md:w-64 h-full bg-gray-800/50 border-r border-gray-700 p-2 md:p-4"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Profile Link */}
        <NavLink
          to="/profile"
          className="flex items-center gap-4 mb-8 p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <img
            src={user.avatar || `https://i.pravatar.cc/150?u=${user.email}`}
            alt={user.name}
            className="w-12 h-12 rounded-full border-2 border-emerald-400"
          />
          <div className="hidden md:block">
            <h2 className="font-bold text-lg text-white truncate">
              {user.name}
            </h2>
            <p className="text-sm text-gray-400">View Profile</p>
          </div>
        </NavLink>

        {/* Main Navigation Links */}
        <nav className="flex flex-col gap-3 flex-grow">
          <NavLink
            to="/dashboard"
            end // Use 'end' to only match the exact path
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 transition-colors"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            <HomeIcon />
            <span className="font-semibold hidden md:inline">Dashboard</span>
          </NavLink>
          <NavLink
            to="/chat"
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 transition-colors"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
          >
            <ChatIcon />
            <span className="font-semibold hidden md:inline">Chat</span>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-4 p-3 rounded-lg text-gray-400 hover:bg-red-800/50 hover:text-white transition-colors"
          >
            <LogoutIcon />
            <span className="font-semibold hidden md:inline">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* --- Main Content Area --- */}
      <main className="flex-grow h-full overflow-y-auto">
        <Outlet />{" "}
        {/* Your pages (Dashboard, ChatPage, ProfilePage) will render here */}
      </main>
    </div>
  );
};

export default MainLayout;
