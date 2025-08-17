import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("CLIENT: Attempting to connect with cookie auth");
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
      });
      setSocket(newSocket);

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      newSocket.on("connect", () => {
        console.log("Socket connected successfully:", newSocket.id);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      return () => {
        newSocket.off("getOnlineUsers");
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
