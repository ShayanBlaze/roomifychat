import { useEffect, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { SocketProvider } from "./SocketProvider";
import api from "../../../services/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token && !user) {
        try {
          const res = await api.get("/user/profile");
          setUser(res.data);
        } catch (err) {
          console.error("Token is invalid, logging out:", err);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (data) => {
    try {
      localStorage.setItem("token", data.token);
      setToken(data.token);

      const profileResponse = await api.get("/user/profile");
      setUser(profileResponse.data);
    } catch (error) {
      console.error("Failed to fetch profile after login. Logging out.", error);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = (updatedUserData) => {
    setUser((currentUser) => ({ ...currentUser, ...updatedUserData }));
  };

  const isAuthenticated = !!user;
  const providerValue = {
    token,
    loading,
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={providerValue}>
      <SocketProvider>{!loading && children}</SocketProvider>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
