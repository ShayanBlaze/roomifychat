import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { formatDistanceToNowStrict } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";

import Sidebar from "./Sidebar";
import Header from "./Header";

import useAuth from "../../features/auth/hooks/useAuth";
import { useSocket } from "../../features/auth/context/SocketProvider";
import api from "../../services/api";
import { LayoutProvider, useLayout } from "../../context/LayoutContext";

const LayoutComponent = () => {
  const { user, setConversations, isAuthenticated } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const { conversationId } = useParams();

  const [headerDetails, setHeaderDetails] = useState({ title: "Dashboard" });
  const [typingUsers, setTypingUsers] = useState([]);

  const {
    isSidebarVisible,
    toggleSidebar,
    isSidebarCollapsed,
    toggleSidebarCollapse,
  } = useLayout();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      api
        .get("/conversations")
        .then((response) => setConversations(response.data))
        .catch((error) =>
          console.error("Failed to fetch conversations", error)
        );
    }
  }, [isAuthenticated, setConversations]);

  useEffect(() => {
    if (!socket) return;

    const handleInAppNotification = ({ message, conversationId, sender }) => {
      if (location.pathname.includes(`/chat/${conversationId}`)) return;

      toast.custom(
        (t) => (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full max-w-sm bg-gray-800/80 backdrop-blur-lg shadow-2xl rounded-xl overflow-hidden border border-white/10 cursor-pointer`}
            onClick={() => {
              navigate(`/chat/${conversationId}`);
              toast.dismiss(t.id);
            }}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={sender.avatar}
                    alt={sender.name}
                  />
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium text-white">
                    {sender.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-400 truncate">
                    {message.type === "image" ? "📷 Photo" : message.content}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.dismiss(t.id);
                    }}
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-700/50 hover:text-white transition-colors"
                  >
                    <IoClose className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ),
        { id: `notification-${conversationId}`, position: "top-center" }
      );
    };

    const handleConversationUpdated = (updatedConvo) => {
      setConversations((prevConvos) => {
        const convoExists = prevConvos.some(
          (convo) => convo._id === updatedConvo._id
        );
        let newConvos = convoExists
          ? prevConvos.map((convo) =>
              convo._id === updatedConvo._id ? updatedConvo : convo
            )
          : [updatedConvo, ...prevConvos];

        return newConvos.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      });
    };

    const handleConversationDeleted = ({ conversationId: deletedConvoId }) => {
      setConversations((prevConvos) =>
        prevConvos.filter((convo) => convo._id !== deletedConvoId)
      );
      if (location.pathname.includes(`/chat/${deletedConvoId}`)) {
        toast.error("This conversation has been deleted.");
        navigate("/dashboard");
      }
    };

    socket.on("inAppNotification", handleInAppNotification);
    socket.on("conversation_updated", handleConversationUpdated);
    socket.on("conversation_deleted", handleConversationDeleted);

    return () => {
      socket.off("inAppNotification", handleInAppNotification);
      socket.off("conversation_updated", handleConversationUpdated);
      socket.off("conversation_deleted", handleConversationDeleted);
    };
  }, [socket, setConversations, location.pathname, navigate]);

  useEffect(() => {
    const getHeaderDetails = async () => {
      const pathname = location.pathname;
      if (pathname.startsWith("/chat/") && conversationId) {
        if (conversationId === "general") {
          setHeaderDetails({
            title: "# general",
            avatar: null,
            activityStatus: `${onlineUsers.length} users online`,
          });
          return;
        }
        try {
          const { data: conversation } = await api.get(
            `/conversations/${conversationId}`
          );
          const otherParticipant = conversation.participants.find(
            (p) => p._id !== user._id
          );
          if (otherParticipant) {
            const isOnline = onlineUsers.includes(otherParticipant._id);
            const status = isOnline
              ? "Online"
              : otherParticipant.lastSeen
              ? `Last seen ${formatDistanceToNowStrict(
                  new Date(otherParticipant.lastSeen),
                  { addSuffix: true }
                )}`
              : "Offline";
            setHeaderDetails({
              title: otherParticipant.name,
              avatar: otherParticipant.avatar,
              activityStatus: status,
            });
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            try {
              const { data: otherUser } = await api.get(
                `/user/${conversationId}`
              );
              const isOnline = onlineUsers.includes(otherUser._id);
              const status = isOnline
                ? "Online"
                : otherUser.lastSeen
                ? `Last seen ${formatDistanceToNowStrict(
                    new Date(otherUser.lastSeen),
                    { addSuffix: true }
                  )}`
                : "Offline";
              setHeaderDetails({
                title: otherUser.name,
                avatar: otherUser.avatar,
                activityStatus: status,
              });
            } catch (userError) {
              console.error(
                "Failed to fetch user details for new chat header",
                userError
              );
              setHeaderDetails({ title: "New Chat" });
            }
          } else {
            console.error("Failed to fetch header details", error);
            setHeaderDetails({ title: "Chat" });
          }
        }
      } else if (pathname.startsWith("/profile")) {
        setHeaderDetails({ title: "Profile", avatar: user.avatar });
      } else {
        setHeaderDetails({ title: "Dashboard", avatar: null });
      }
    };
    if (user) {
      getHeaderDetails();
    }
  }, [location.pathname, conversationId, user, onlineUsers]);

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-900">
        <div className="w-8 h-8 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <div
        className={`hidden md:flex flex-col h-full bg-gray-900 relative transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-24" : "w-80"
        }`}
      >
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <button
          onClick={toggleSidebarCollapse}
          className="absolute -right-3 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-emerald-600 text-white p-1.5 rounded-full z-10 transition-colors"
          aria-label={
            isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
        >
          {isSidebarCollapsed ? (
            <IoChevronForward className="w-4 h-4" />
          ) : (
            <IoChevronBack className="w-4 h-4" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {isSidebarVisible && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-gray-900 z-50 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Sidebar onLinkClick={toggleSidebar} isCollapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          title={headerDetails.title}
          avatar={headerDetails.avatar}
          activityStatus={headerDetails.activityStatus}
          typingUsers={
            location.pathname.startsWith("/chat/") ? typingUsers : []
          }
          onMenuClick={toggleSidebar}
        />
        <main className="flex-1 flex flex-col min-h-0">
          <Outlet context={{ setTypingUsers }} />
        </main>
      </div>
    </div>
  );
};

const MainLayoutWrapper = () => {
  return (
    <LayoutProvider>
      <LayoutComponent />
    </LayoutProvider>
  );
};

export default MainLayoutWrapper;
