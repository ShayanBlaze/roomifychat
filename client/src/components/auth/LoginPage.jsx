import { useState } from "react";
import authService from "../../service/authService";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const auth = useAuth();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login(formData);
      auth.login(data);
      navigate("/dashboard");
      // console.log("Login successful:", data);
    } catch (error) {
      console.log("Login failed:", error);
    }
  };

  return (
    <div className="mt-24 p-4 max-w-md mx-auto border">
      <h1 className="text-2xl font-bold text-center p-3 mb-6">Login</h1>
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-center items-center gap-10"
      >
        <input
          className="border border-gray-300 p-2 rounded w-full"
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          required
        />
        <input
          className="border border-gray-300 p-2 rounded w-full"
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
