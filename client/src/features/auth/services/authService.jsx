import api from "../../../services/api";


const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  console.log("User registered:", response.data);
  return response.data;
};

const login = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

const authService = {
  register,
  login,
};

export default authService;
