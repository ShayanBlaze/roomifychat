import { useEffect, useState } from "react";
import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../features/auth/hooks/useAuth";
import ConversationList from "../UI/ConversationList";
import { useSocket } from "../../features/auth/context/SocketProvider";
import api from "../../services/api";

// --- icons ---
const HomeIcon = () => (
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
      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5"
    />
  </svg>
);

const ChatIcon = () => (
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
      d="M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.405l-4.093 1.023a.75.75 0 01-.928-.928l1.023-4.093A9.76 9.76 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
    />
  </svg>
);

const LogoutIcon = () => (
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
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
    />
  </svg>
);
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
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SidebarContent = ({ onLinkClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <div className="w-8 h-8 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm">Loading User...</p>
      </div>
    );
  }

  const handleLogout = () => {
    onLinkClick?.();
    logout();
    navigate("/login");
  };

  const activeLinkStyle = {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    color: "white",
  };

  return (
    <div className="flex flex-col h-full">
      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={onLinkClick}
          className="p-1 text-gray-400 hover:text-white"
        >
          <CloseIcon />
        </button>
      </div>
      <NavLink
        to="/profile"
        onClick={onLinkClick}
        className="flex items-center gap-4 mb-8 p-2 rounded-lg hover:bg-gray-700 transition-colors"
        style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
      >
        <img
          src={user.avatar || `https://i.pravatar.cc/150?u=${user.email}`}
          alt={user.name}
          className="w-12 h-12 rounded-full border-2 border-emerald-400"
        />
        <div>
          <h2 className="font-bold text-lg text-white truncate">{user.name}</h2>
          <p className="text-sm text-gray-400">View Profile</p>
        </div>
      </NavLink>
      <nav className="flex flex-col gap-3 flex-grow">
        <NavLink
          to="/dashboard"
          end
          onClick={onLinkClick}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 transition-colors"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
        >
          <HomeIcon />
          <span className="font-semibold">Dashboard</span>
        </NavLink>
        <NavLink
          to="/chat/general"
          onClick={onLinkClick}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 transition-colors"
          style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
        >
          <ChatIcon />
          <span className="font-semibold">Chat</span>
        </NavLink>
        <ConversationList onLinkClick={onLinkClick} />
      </nav>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-4 p-3 rounded-lg text-gray-400 hover:bg-red-800/50 hover:text-white transition-colors cursor-pointer"
        >
          <LogoutIcon />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
};

const Header = ({ typingUsers, onMenuClick, title, avatar }) => {
  const getTypingText = () => {
    if (!typingUsers || typingUsers.length === 0) return "";
    const names = typingUsers.map((u) => u.name);
    if (names.length === 1) return `${names[0]} is typing...`;
    if (names.length === 2) return `${names[0]} and ${names[1]} are typing...`;
    return "Several people are typing...";
  };

  return (
    <header className="flex shrink-0 items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
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
              {typingUsers && typingUsers.length > 0 && (
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
      <div className="w-8 h-8 md:hidden"></div>
    </header>
  );
};

const MobileHeader = ({ onMenuClick, title }) => (
  <header className="md:hidden flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
    <button onClick={onMenuClick} className="p-2 text-white">
      <MenuIcon />
    </button>
    <h1 className="text-xl font-bold text-white">{title}</h1>
    <div className="w-8"></div>
  </header>
);

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const socket = useSocket();
  const { setConversations, user } = useAuth();
  const { conversationId } = useParams();

  const [headerDetails, setHeaderDetails] = useState({ title: "Dashboard" });
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    const getHeaderDetails = async () => {
      const pathname = location.pathname;
      if (pathname.startsWith("/chat/") && conversationId) {
        if (conversationId === "general") {
          setHeaderDetails({ title: "# general", avatar: null });
        } else {
          try {
            const { data: conversation } = await api.get(
              `/conversations/${conversationId}`
            );
            const otherParticipant = conversation.participants.find(
              (p) => p._id !== user._id
            );
            if (otherParticipant) {
              setHeaderDetails({
                title: otherParticipant.name,
                avatar: otherParticipant.avatar,
              });
            }
          } catch (error) {
            setHeaderDetails({ title: "Private Chat", avatar: null });
            console.error("Failed to fetch header details", error);
          }
        }
      } else if (pathname.startsWith("/profile")) {
        setHeaderDetails({ title: "Profile", avatar: null });
      } else {
        setHeaderDetails({ title: "Dashboard", avatar: null });
      }
    };

    if (user) {
      getHeaderDetails();
    }
  }, [location.pathname, conversationId, user]);

  useEffect(() => {
    if (!socket) return;
    const handleUserTyping = (data) => {
      setTypingUsers((prev) => [...prev.filter((u) => u.id !== data.id), data]);
    };
    const handleUserStoppedTyping = (data) => {
      setTypingUsers((prev) => prev.filter((u) => u.id !== data.id));
    };

    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleNewConversation = (newConvo) => {
      console.log("!!! EVENT RECEIVED: 'conversation_started'", newConvo);

      setConversations((previousConversations) => {
        console.log("--- Updating conversations state ---");
        console.log("Previous conversations:", previousConversations);

        const isAlreadyInList = previousConversations.some(
          (c) => c._id === newConvo._id
        );

        if (isAlreadyInList) {
          console.log("Conversation already exists. No update needed.");
          return previousConversations;
        }

        const updatedConversations = [newConvo, ...previousConversations];
        console.log("New conversations state:", updatedConversations);
        return updatedConversations;
      });
    };

    const handleConversationUpdated = (updatedConvo) => {
      console.log("✅ Conversation updated:", updatedConvo);
      setConversations((prevConvos) => {
        const newConvos = prevConvos.map((convo) =>
          convo._id === updatedConvo._id ? updatedConvo : convo
        );
        return newConvos.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      });
    };

    socket.on("conversation_started", handleNewConversation);
    socket.on("conversation_updated", handleConversationUpdated);

    return () => {
      socket.off("conversation_started", handleNewConversation);
      socket.off("conversation_updated", handleConversationUpdated);
    };
  }, [socket, setConversations]);

  return (
    <div className="flex h-screen w-full bg-gray-900 text-gray-300">
      {/* Sidebar: Always visible on desktop */}
      <aside className="hidden md:flex flex-col w-64 h-full bg-gray-800/50 border-r border-gray-700 p-4">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-gray-800 z-50 p-4 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <SidebarContent onLinkClick={() => setIsMobileMenuOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-grow h-full flex flex-col overflow-hidden">
        <Header
          onMenuClick={() => setIsMobileMenuOpen(true)}
          title={headerDetails.title}
          avatar={headerDetails.avatar}
          typingUsers={
            location.pathname.startsWith("/chat/") ? typingUsers : []
          }
        />
        <Outlet context={{ onMenuClick: () => setIsMobileMenuOpen(true) }} />
      </main>
    </div>
  );
};

export default MainLayout;
