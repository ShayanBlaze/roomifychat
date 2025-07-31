import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const apiURL = `${API_URL}/auth`;

const register = async (userData) => {
  const response = await axios.post(apiURL + "/register", userData);

  console.log("User registered:", response.data);
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(apiURL + "/login", userData);

  return response.data;
};

const authService = {
  register,
  login,
};

export default authService;
