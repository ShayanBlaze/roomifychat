import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import authService from "../services/authService";
import useAuth from "../hooks/useAuth";

const AuthIllustration = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div
      className="absolute w-64 h-64 bg-teal-500 rounded-full mix-blend-lighten filter blur-2xl opacity-50"
      animate={{
        scale: [1, 1.2, 1],
        x: [-20, 20, -20],
        rotate: [0, 90, 0],
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-48 h-48 bg-cyan-500 rounded-full mix-blend-lighten filter blur-2xl opacity-50"
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
      Join Our Community
      <p className="text-lg font-light mt-2">Start your journey today</p>
    </h2>
  </div>
);

const InputField = ({ icon, type, name, value, onChange, placeholder }) => (
  <div className="relative flex items-center">
    <span className="absolute left-4 text-gray-400">{icon}</span>
    <input
      className="w-full pl-12 pr-4 py-3 bg-gray-700/50 text-white border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300"
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
    />
  </div>
);

const Spinner = () => (
  <motion.div
    className="w-6 h-6 border-4 border-t-transparent border-white rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const { name, email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const data = await authService.register(formData);
      await auth.login(data);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. This email may already be in use.");
      console.error("Error registering user:", err);
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
              <h1 className="text-4xl font-bold text-white">Create Account</h1>
              <p className="mt-2 text-gray-400">
                Join us and start your journey.
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
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                }
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Full Name"
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
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                }
                type="email"
                name="email"
                value={email}
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
                value={password}
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

            <motion.button
              type="submit"
              className="flex items-center justify-center w-full py-3 font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 transition-all duration-300"
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
                    Create Account
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.p
              className="text-sm text-center text-gray-400"
              variants={itemVariants}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Sign In
              </Link>
            </motion.p>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
