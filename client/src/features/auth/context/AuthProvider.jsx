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
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setConversations([]);
      setIsAuthenticated(false);
    }
  }, []);

  const login = useCallback(async (data) => {
    setUser(data.user);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const [profileRes, convosRes] = await Promise.all([
          api.get("/user/profile"),
          api.get("/conversations"),
        ]);
        setUser(profileRes.data);
        setConversations(convosRes.data);
        setIsAuthenticated(true);
      } catch (err) {
        setUser(null);
        setConversations([]);
        setIsAuthenticated(false);
        console.log("User not authenticated", err);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  const providerValue = {
    user,
    loading,
    isAuthenticated,
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
