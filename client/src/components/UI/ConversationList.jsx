// src/components/ConversationList.jsx

import { NavLink } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";

/**
 * A helper function to check if a string contains Persian characters.
 * @param {string} text - The text to check.
 * @returns {boolean} - True if the text contains Persian characters, otherwise false.
 */
const isPersian = (text) => {
  if (!text) return false;
  const persianRegex = /[\u0600-\u06FF]/;
  return persianRegex.test(text);
};

const ConversationList = ({ onLinkClick }) => {
  const { user: currentUser, conversations } = useAuth();

  if (!currentUser || conversations.length === 0) {
    return null;
  }

  // Refined class function for a more polished look
  const getNavLinkClassName = ({ isActive }) =>
    `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200 ease-in-out ${
      isActive
        ? "bg-emerald-500/20" // A more subtle but clear active state
        : "hover:bg-gray-700/60"
    }`;

  return (
    <div className="flex flex-col gap-2 p-2 mt-4 border-t border-gray-700">
      <h3 className="px-3 pt-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
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
              onClick={onLinkClick}
            >
              {/* Avatar */}
              <img
                src={otherParticipant.avatar}
                alt={`${otherParticipant.name}'s avatar`}
                className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
              />

              {/* Name and Message container */}
              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <div className="flex items-center justify-between">
                  <span className="truncate font-semibold text-gray-100">
                    {otherParticipant.name}
                  </span>
                  {/* Optional: Add a timestamp here if you have one */}
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
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
