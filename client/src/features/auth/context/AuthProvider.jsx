import { useEffect, useState } from "react";
import setAuthToken from "../services/setAuthToken";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const localToken = localStorage.getItem("token");
      if (localToken) {
        setAuthToken(localToken);
        try {
          const res = await axios.get(`${API_URL}/auth/me`);
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Failed to load user:", err);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = (data) => {
    const token = localStorage.setItem("token", data.token);
    setAuthToken(token);
    setToken(token);
    setIsAuthenticated(true);
    setUser(data.user);
    setLoading(false);
  };

  const registerSuccess = (data) => {
    login(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const providerValue = {
    token,
    isAuthenticated,
    loading,
    user,
    login,
    logout,
    registerSuccess,
  };

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
