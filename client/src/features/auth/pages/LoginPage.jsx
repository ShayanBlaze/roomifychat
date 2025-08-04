import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../services/authService"; // Your auth service
import useAuth from "../hooks/useAuth"; // Your auth hook

// --- Helper Components --- //

// A cool, abstract animated illustration for the side panel
const AuthIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div
      className="absolute w-64 h-64 bg-indigo-500 rounded-full mix-blend-lighten filter blur-2xl opacity-50"
      animate={{
        scale: [1, 1.2, 1],
        x: [-20, 20, -20],
        rotate: [0, 90, 0],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-48 h-48 bg-purple-500 rounded-full mix-blend-lighten filter blur-2xl opacity-50"
      animate={{
        scale: [1, 1.1, 1],
        y: [30, -30, 30],
        rotate: [0, -90, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2,
      }}
    />
    <h2 className="relative text-4xl font-bold text-white text-center z-10">
      RoomifyChat
      <p className="text-lg font-light mt-2">Connect and Collaborate</p>
    </h2>
  </div>
);

// A reusable input field with an icon
const InputField = ({ icon, type, name, value, onChange, placeholder }) => (
  <div className="relative flex items-center">
    <span className="absolute left-4 text-gray-400">{icon}</span>
    <input
      className="w-full pl-12 pr-4 py-3 bg-gray-700/50 text-white border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
    />
  </div>
);

// A simple loading spinner
const Spinner = () => (
  <motion.div
    className="w-6 h-6 border-4 border-t-transparent border-white rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);

// --- Main LoginPage Component --- //

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const from = location.state?.from?.pathname || "/dashboard";

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const data = await authService.login(formData);
      auth.login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" } },
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <motion.div
        className="flex w-full max-w-4xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Left Side: Illustration */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-gray-800">
          <AuthIllustration />
        </div>

        {/* Right Side: Form */}
        <div className="w-full p-8 md:w-1/2 flex flex-col justify-center">
          <motion.form
            onSubmit={onSubmit}
            className="flex flex-col w-full gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="text-center" variants={itemVariants}>
              <h1 className="text-4xl font-bold text-white">Sign In</h1>
              <p className="mt-2 text-gray-400">
                Welcome back! Please enter your details.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <InputField
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                }
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Email Address"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <InputField
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                }
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Password"
              />
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  className="text-sm text-center text-red-400"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div
              className="flex justify-between items-center text-sm"
              variants={itemVariants}
            ></motion.div>

            <motion.button
              type="submit"
              className="flex items-center justify-center w-full py-3 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="spinner"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Spinner />
                  </motion.div>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.p
              className="text-sm text-center text-gray-400"
              variants={itemVariants}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Register Now
              </Link>
            </motion.p>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
