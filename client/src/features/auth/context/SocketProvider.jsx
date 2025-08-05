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
      const newSocket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
      });

      setSocket(newSocket);

      newSocket.on("connect", () =>
        console.log("Socket connected via Provider:", newSocket.id)
      );
      newSocket.on("connect_error", (err) =>
        console.error("Socket connection error:", err.message)
      );

      return () => {
        console.log("Disconnecting socket from provider...");
        newSocket.disconnect();
      };
    } else if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
