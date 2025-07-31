import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import authService from "../services/authService";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
  });
  const navigate = useNavigate();
  const auth = useAuth();

  const { name, password, email } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.register(formData);
      auth.registerSuccess(data);
      navigate("/dashboard");
    } catch (error) {
      console.log("Error registering user:", error);
    }
  };

  return (
    <div className="mt-24 p-4 max-w-md mx-auto border">
      <div>
        <h1 className="text-2xl font-bold text-center p-3 mb-6">Register</h1>
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center items-center gap-10"
        >
          <input
            className="border border-gray-300 p-2 rounded w-full"
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Name"
            required
          />
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
            minLength="6"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
