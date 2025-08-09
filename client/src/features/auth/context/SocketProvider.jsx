import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";

const SOCKET_URL = "http://localhost:3000";
const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      const newSocket = io(SOCKET_URL, { auth: { token } });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected successfully:", newSocket.id);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setSocket(null);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
