import { useEffect, useState, useCallback, createContext } from "react";
import api from "../../../services/api";

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  conversations: [],
  logout: () => {},
  setConversations: () => {},
  updateUser: () => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setConversations([]);
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const [profileRes, convosRes] = await Promise.all([
            api.get("/user/profile"),
            api.get("/conversations"),
          ]);
          setUser(profileRes.data);
          setConversations(convosRes.data);
        } catch (err) {
          console.error("Token is invalid or expired, logging out:", err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token, logout]);

  const login = useCallback(async (data) => {
    localStorage.setItem("token", data.token);
    setToken(data.token);
  }, []);

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  const providerValue = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    conversations,
    login,
    logout,
    setConversations,
    updateUser,
  };

  return (
    <AuthContext.Provider value={providerValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
