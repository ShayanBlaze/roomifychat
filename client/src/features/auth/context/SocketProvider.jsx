import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (token) {
      console.log("CLIENT: Attempting to connect with token:", token);
      const newSocket = io(SOCKET_URL, { auth: { token } });
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
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
