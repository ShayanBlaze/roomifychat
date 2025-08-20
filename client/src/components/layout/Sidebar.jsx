import { useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  IoHomeOutline,
  IoChatbubblesOutline,
  IoLogOutOutline,
  IoSearchOutline,
} from "react-icons/io5";

import useAuth from "../../features/auth/hooks/useAuth";
import { useLayout } from "../../context/LayoutContext";
import ConversationList from "../UI/ConversationList";
import anonymousAvatar from "/anonymous-avatar.jpg";

const Sidebar = ({ onLinkClick, isCollapsed }) => {
  const { user, loading: isLoading, logout, conversations } = useAuth();
  const { searchQuery, handleSearchChange } = useLayout();
  const navigate = useNavigate();

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    return conversations.filter((convo) => {
      const otherParticipant = convo.participants.find(
        (p) => p._id !== user._id
      );
      return otherParticipant?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
  }, [conversations, searchQuery, user?._id]);

  const handleLogout = () => {
    if (onLinkClick) onLinkClick();
    logout();
    navigate("/login");
  };

  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = `flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 ${
      isCollapsed ? "justify-center" : ""
    }`;
    const activeClasses = "bg-emerald-600 text-white font-semibold shadow-lg";
    const inactiveClasses =
      "text-gray-400 hover:bg-gray-700/60 hover:text-white";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <aside className="flex flex-col h-full w-full bg-gray-900 text-white border-r border-gray-700/50">
      <div className="p-4">
        <Link
          to="/profile"
          onClick={onLinkClick}
          className={`flex items-center gap-4 mb-4 p-2 rounded-lg hover:bg-gray-700/60 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <img
            src={user?.avatar || anonymousAvatar}
            alt="User Avatar"
            className="w-12 h-12 rounded-full border-2 border-emerald-400 shrink-0"
          />
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg text-white truncate">
                {user?.name}
              </h2>
              <p className="text-sm text-gray-400">View Profile</p>
            </div>
          )}
        </Link>

        {/* Search Input */}
        {!isCollapsed && (
          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}
      </div>

      {/* Navigation Links & Conversations */}
      <div className="flex-1 flex flex-col overflow-y-auto min-h-0 px-4">
        <nav className="flex-shrink-0 space-y-2">
          <NavLink
            to="/dashboard"
            end
            className={getNavLinkClass}
            onClick={onLinkClick}
          >
            <IoHomeOutline className="w-6 h-6 shrink-0" />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>
          <NavLink
            to="/chat/general"
            className={getNavLinkClass}
            onClick={onLinkClick}
          >
            <IoChatbubblesOutline className="w-6 h-6 shrink-0" />
            {!isCollapsed && <span>Chat</span>}
          </NavLink>
        </nav>

        {isLoading ? (
          <p className="p-4 text-center text-gray-400">Loading...</p>
        ) : (
          <ConversationList
            conversations={filteredConversations}
            onLinkClick={onLinkClick}
            isCollapsed={isCollapsed}
          />
        )}
      </div>

      {/* Logout button */}
      <div className="mt-auto flex-shrink-0 p-4 border-t border-gray-700/50">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full gap-4 p-3 rounded-lg text-gray-400 hover:bg-red-800/50 hover:text-white transition-colors cursor-pointer ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <IoLogOutOutline className="w-6 h-6 shrink-0" />
          {!isCollapsed && <span className="font-semibold">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
