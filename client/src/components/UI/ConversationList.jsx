import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { BsThreeDotsVertical, BsTrash, BsEnvelopeOpen } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import useAuth from "../../features/auth/hooks/useAuth";
import { useSocket } from "../../features/auth/context/SocketProvider";
import api from "../../services/api";

const isPersian = (text) => {
  if (!text) return false;
  const persianRegex = /[\u0600-\u06FF]/;
  return persianRegex.test(text);
};

const ConversationList = ({ onLinkClick }) => {
  const { user: currentUser, conversations, setConversations } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuToggle = (e, conversationId) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId((prevId) =>
      prevId === conversationId ? null : conversationId
    );
  };
  const handleMarkAsRead = (e, conversationId) => {
    e.preventDefault();
    e.stopPropagation();
    if (socket) {
      socket.emit("markConversationAsRead", { conversationId });
    }
    setOpenMenuId(null);
  };

  const handleDelete = async (e, conversationId) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(null);
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      try {
        await api.delete(`/conversations/${conversationId}`);
        setConversations((prev) =>
          prev.filter((convo) => convo._id !== conversationId)
        );
        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to delete conversation:", error);
        alert("Error deleting conversation.");
      }
    }
  };

  if (!currentUser || !conversations || conversations.length === 0) {
    return null;
  }

  const getNavLinkClassName = ({ isActive }) =>
    `group relative flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 py-2 sm:px-3 sm:py-2.5 transition-colors duration-200 ease-in-out ${
      isActive ? "bg-emerald-500/20" : "hover:bg-gray-700/60"
    }`;

  return (
    <div className="flex flex-col gap-2 p-2 mt-4 border-t border-gray-700">
      <h3 className="px-2 sm:px-3 pt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Messages
      </h3>
      <div className="flex flex-col gap-1">
        {conversations.map((convo) => {
          const otherParticipant = convo.participants.find(
            (p) => p._id !== currentUser._id
          );
          if (!otherParticipant) return null;

          const unreadInfo = convo.unreadCounts?.find(
            (uc) => uc.userId === currentUser._id
          );
          const unreadCount = unreadInfo?.count || 0;
          const displayCount = unreadCount > 9 ? "9+" : unreadCount;

          const lastMessage = convo.lastMessage;
          const messageIsPersian = isPersian(lastMessage?.content);

          let lastMessageContent = "";
          if (lastMessage) {
            lastMessageContent =
              lastMessage.type === "image" ? "📷 Photo" : lastMessage.content;
          }

          return (
            <NavLink
              key={convo._id}
              to={`/chat/${convo._id}`}
              state={{ conversation: convo }}
              className={getNavLinkClassName}
              onClick={() => {
                setOpenMenuId(null);
                if (onLinkClick) onLinkClick();
              }}
            >
              <img
                src={otherParticipant.avatar}
                alt={`${otherParticipant.name}'s avatar`}
                className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded-full object-cover"
              />

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="flex items-center justify-between">
                  <span className="truncate font-semibold text-gray-100">
                    {otherParticipant.name}
                  </span>
                </div>
                {lastMessage && (
                  <p
                    className={`mt-0.5 truncate text-sm ${
                      messageIsPersian ? "text-right" : "text-left"
                    } ${
                      unreadCount > 0 ? "text-white font-bold" : "text-gray-400"
                    }`}
                    dir={messageIsPersian ? "rtl" : "ltr"}
                  >
                    {lastMessageContent}
                  </p>
                )}
                {lastMessage?.createdAt && (
                  <span className="text-xs text-gray-500 mt-1">
                    <time dateTime={lastMessage.createdAt}>
                      {formatDistanceToNow(new Date(lastMessage.createdAt), {
                        addSuffix: true,
                      })}
                    </time>
                  </span>
                )}
              </div>

              <div className="flex flex-col items-center justify-between h-full ml-auto flex-shrink-0">
                <div
                  className="relative"
                  ref={openMenuId === convo._id ? menuRef : null}
                >
                  <button
                    onClick={(e) => handleMenuToggle(e, convo._id)}
                    className="p-1.5 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer"
                    aria-label="More options"
                  >
                    <BsThreeDotsVertical className="h-5 w-5" />
                  </button>

                  <AnimatePresence>
                    {openMenuId === convo._id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute right-4 mt-2 w-48 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <div className="py-1" role="none">
                          {unreadCount > 0 && (
                            <button
                              onClick={(e) => handleMarkAsRead(e, convo._id)}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-cyan-300 hover:bg-gray-700 cursor-pointer"
                              role="menuitem"
                            >
                              <BsEnvelopeOpen className="h-5 w-5" />
                              <span>Mark as read</span>
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDelete(e, convo._id)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 cursor-pointer"
                            role="menuitem"
                          >
                            <BsTrash className="h-5 w-5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="mt-2 w-6 h-6 flex items-center justify-center bg-emerald-500 text-white text-xs font-bold rounded-full"
                    >
                      {displayCount}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
