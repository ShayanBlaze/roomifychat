import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";

const ConversationList = () => {
  const { user: currentUser, conversations } = useAuth();

  if (!currentUser || conversations.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 mt-4 border-t border-gray-700 pt-4">
      <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Messages
      </h3>
      {conversations.map((convo) => {
        const otherParticipant = convo.participants.find(
          (p) => p._id !== currentUser._id
        );

        if (!otherParticipant) return null;

        return (
          <NavLink
            key={convo._id}
            to={`/chat/${convo._id}`}
            state={{ conversation: convo }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
            style={({ isActive }) =>
              isActive ? { backgroundColor: "rgba(34, 197, 94, 0.2)" } : {}
            }
          >
            <img
              src={otherParticipant.avatar}
              alt={otherParticipant.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium text-white truncate">
              {otherParticipant.name}
            </span>
          </NavLink>
        );
      })}
    </div>
  );
};

export default ConversationList;
