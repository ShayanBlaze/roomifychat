import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";
import api from "../../services/api";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const ThreeDotsIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
  </svg>
);

const TrashIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

const isPersian = (text) => {
  if (!text) return false;
  const persianRegex = /[\u0600-\u06FF]/;
  return persianRegex.test(text);
};

const ConversationList = ({ onLinkClick }) => {
  const { user: currentUser, conversations, setConversations } = useAuth();
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

  const handleDelete = async (conversationId) => {
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

          const lastMessage = convo.lastMessage;
          const messageIsPersian = isPersian(lastMessage?.content);

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
                    } ${lastMessage.isRead ? "text-gray-400" : "text-white"}`}
                    dir={messageIsPersian ? "rtl" : "ltr"}
                  >
                    {lastMessage.content}
                  </p>
                )}
              </div>

              <div
                className="ml-auto flex-shrink-0"
                ref={openMenuId === convo._id ? menuRef : null}
              >
                <button
                  onClick={(e) => handleMenuToggle(e, convo._id)}
                  className="p-1.5 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white"
                  aria-label="More options"
                >
                  <ThreeDotsIcon className="h-5 w-5" />
                </button>

                {openMenuId === convo._id && (
                  <div
                    className="absolute right-4 mt-2 w-48 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
                    role="menu"
                    aria-orientation="vertical"
                  >
                    <div className="py-1" role="none">
                      <button
                        onClick={() => handleDelete(convo._id)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                        role="menuitem"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
